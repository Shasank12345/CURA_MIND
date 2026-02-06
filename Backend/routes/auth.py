import os
import random
from datetime import datetime, timedelta, timezone
from flask import Blueprint, request, jsonify, session
from supabase import create_client
from extension import db
from model import Account, Doctor, User, Otp
from utilities import send_mail, gen_pass
from werkzeug.utils import secure_filename

auth = Blueprint('auth', __name__)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)

@auth.route('/sign_up', methods=['POST'])
def sign_up():
    # Detect if it's Multipart (Doctor) or JSON (User)
    data = request.form if request.form else request.get_json()
    
    role = data.get('role')
    # Unified key check for Email
    email = data.get('Email') if data.get('Email') else data.get('email')

    if not email or not role:
        return jsonify({"error": "Missing email or role"}), 400

    try:
        if Account.query.filter_by(email=email).first():
            return jsonify({"error": "Email already registered"}), 409

        temp_password = gen_pass()
        new_account = Account(
            email=email,
            password=temp_password, 
            role=role,
            is_temp_password=True,
            is_verified=(role == 'User') 
        )
        db.session.add(new_account)
        db.session.flush()

        if role == 'Doctor':
            full_name = data.get('Full_Name')
            license_no = data.get('License_No')
            specialty = data.get('Specialization')
            phone = data.get('Phone_Number')
            dob_str = data.get('DOB')
            
            if not all([full_name, license_no, specialty, phone, dob_str]):
                return jsonify({"error": "Missing mandatory fields"}), 400
                
            try:
                dob_date = datetime.strptime(dob_str, '%Y-%m-%d').date()
            except ValueError:
                return jsonify({"error": "Invalid DOB format. Use YYYY-MM-DD"}), 400
                
            public_url = None
            if 'License_Img' in request.files:
                file = request.files['License_Img']
                if file.filename != '':
                    ext = secure_filename(file.filename).rsplit('.', 1)[-1]
                    storage_path = f"doc_{new_account.id}.{ext}"
                    file_content = file.read()
                    
                    supabase_client.storage.from_('licenses').upload(
                        path=storage_path,
                        file=file_content,
                        file_options={"content-type": file.content_type}
                    )
                    public_url = supabase_client.storage.from_('licenses').get_public_url(storage_path)

            profile = Doctor(
                acc_id=new_account.id,
                full_name=full_name,
                license_no=license_no,
                area_of_specialization=specialty,
                phone_number=phone,
                dob=dob_date, 
                license_img=public_url,
                hospital_name=data.get('hospital_name'),
                bio_summary=data.get('bio_summary'),
                is_available_online=False
            )
            db.session.add(profile)

        elif role == 'User':
            # FIX: Frontend sends 'dob' or 'DOB'. Be safe.
            dob_str = data.get('dob') if data.get('dob') else data.get('DOB')
            
            try:
                # Convert string to Date object so Postgres doesn't reject it
                dob_date = datetime.strptime(dob_str, '%Y-%m-%d').date() if dob_str else None
            except ValueError:
                return jsonify({"error": "Invalid DOB format. Use YYYY-MM-DD"}), 400
            
            profile = User(
                acc_id=new_account.id,
                # MATCHING YOUR REACT KEYS
                full_name=data.get('full_name') if data.get('full_name') else data.get('Full_Name'),
                phone_number=data.get('phone_number') if data.get('phone_number') else data.get('Phone_Number'),
                address=data.get('address') if data.get('address') else data.get('Address'),
                dob=dob_date
            )
            db.session.add(profile)
            send_mail(email, temp_password)

        db.session.commit()
        return jsonify({"message": "Registration successful"}), 201

    except Exception as e:
        db.session.rollback()
        import traceback
        print(traceback.format_exc())
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True)
    if not data: 
        return jsonify({"error": "Missing body"}), 400

    email = data.get('Email')
    password = data.get('Password')

    account = Account.query.filter_by(email=email).first()

    if not account or account.password != password:
        return jsonify({"error": "Invalid credentials"}), 401

    if not account.is_verified:
        return jsonify({"error": "Account pending verification"}), 403

    session.clear()
    session['account_id'] = account.id 
    session['role'] = account.role
    session['email'] = account.email # <--- NECESSARY: Store email for change_password route
    session.permanent = True 
    
    response_data = {
        "message": "Login successful",
        "role": account.role,
        "user": {"id": account.id},
        "requires_password_update": account.is_temp_password 
    }

    return jsonify(response_data), 200

@auth.route("/change_password", methods=["POST"])
def change_password():
    # Detect email from either a Password Reset session or a First Login session
    email = session.get("reset_email") or session.get("email")
    
    if not email:
        return jsonify({"error": "Unauthorized session"}), 401

    new_pass = request.json.get("NewPassword")
    if not new_pass: 
        return jsonify({"error": "New password required"}), 400

    account = Account.query.filter_by(email=email).first()
    if not account:
        return jsonify({"error": "Account not found"}), 404

    # Update security details
    account.password = new_pass
    account.is_temp_password = False # <--- Flip the flag
    db.session.commit()

    # Clear session to force a fresh login with the new permanent password
    session.clear()
    return jsonify({"message": "Password updated successfully. Please login again."}), 200
@auth.route("/forgot_password", methods=["POST"])
def forgot_password():
    email = request.json.get("Email")
    account = Account.query.filter_by(email=email).first()
    
    if not account:
        return jsonify({"error": "Email not found"}), 404

    otp_code = str(random.randint(100000, 999999))
    expiry = datetime.now(timezone.utc) + timedelta(minutes=5)
    
    Otp.query.filter_by(email=email, used=False).update({"used": True})
    
    new_otp = Otp(email=email, otp=otp_code, expires_at=expiry)
    db.session.add(new_otp)
    db.session.commit()

    send_mail(email, f"Your reset OTP is: {otp_code}")
    return jsonify({"message": "OTP sent"}), 200

@auth.route("/verify_otp", methods=["POST"])
def verify_otp():
    data = request.json
    email = data.get("Email")
    otp_val = data.get("Otp")

    record = Otp.query.filter_by(email=email, otp=otp_val, used=False).first()
    
    if not record or datetime.now(timezone.utc) > record.expires_at.replace(tzinfo=timezone.utc):
        return jsonify({"error": "Invalid or expired OTP"}), 400

    record.used = True
    db.session.commit()
    
    session["reset_email"] = email 
    return jsonify({"message": "OTP verified"}), 200