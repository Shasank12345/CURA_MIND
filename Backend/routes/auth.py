import os
import random
from datetime import datetime, timedelta, timezone
from flask import Blueprint, request, jsonify, session
from supabase import create_client
from extension import db,bcrypt
from model import Account, Doctor, User, Otp
from utilities import send_mail, gen_pass
from werkzeug.utils import secure_filename

auth = Blueprint('auth', __name__)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)

@auth.route('/sign_up', methods=['POST'])
def sign_up():
    data = request.form if request.form else request.get_json()
    role = data.get('role')
    email = data.get('Email') or data.get('email')

    if not email or not role:
        return jsonify({"error": "Missing email or role"}), 400

    try:
        if Account.query.filter_by(email=email).first():
            return jsonify({"error": "Email already registered"}), 409

        temp_password = gen_pass()
        
        hashed_temp_password = bcrypt.generate_password_hash(temp_password).decode('utf-8')

        new_account = Account(
            email=email,
            password=hashed_temp_password, 
            role=role,
            is_temp_password=True,
            is_verified=(role == 'User') 
        )
        db.session.add(new_account)
        db.session.flush()

        if role == 'Doctor':
            required = ['Full_Name', 'License_No', 'Specialization', 'Phone_Number', 'DOB']
            if not all(data.get(field) for field in required):
                return jsonify({"error": "Missing mandatory fields"}), 400
                
            try:
                dob_date = datetime.strptime(data.get('DOB'), '%Y-%m-%d').date()
            except ValueError:
                return jsonify({"error": "Invalid DOB format"}), 400
                
            public_url = None
            if 'License_Img' in request.files:
                file = request.files['License_Img']
                if file.filename != '':
                    ext = secure_filename(file.filename).rsplit('.', 1)[-1]
                    storage_path = f"doc_{new_account.id}.{ext}"
                    supabase_client.storage.from_('licenses').upload(
                        path=storage_path,
                        file=file.read(),
                        file_options={"content-type": file.content_type}
                    )
                    public_url = supabase_client.storage.from_('licenses').get_public_url(storage_path)

            profile = Doctor(
                acc_id=new_account.id,
                full_name=data.get('Full_Name'),
                license_no=data.get('License_No'),
                area_of_specialization=data.get('Specialization'),
                phone_number=data.get('Phone_Number'),
                dob=dob_date, 
                license_img=public_url,
                hospital_name=data.get('hospital_name'),
                bio_summary=data.get('bio_summary'),
                is_available_online=False
            )
            db.session.add(profile)

        elif role == 'User':
            dob_str = data.get('dob') or data.get('DOB')
            dob_date = datetime.strptime(dob_str, '%Y-%m-%d').date() if dob_str else None
            
            profile = User(
                acc_id=new_account.id,
                full_name=data.get('full_name') or data.get('Full_Name'),
                phone_number=data.get('phone_number') or data.get('Phone_Number'),
                address=data.get('address') or data.get('Address'),
                dob=dob_date
            )
            db.session.add(profile)
            send_mail(email, f"Your temporary password is: {temp_password}")

        db.session.commit()
        return jsonify({"message": "Registration successful"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True)
    if not data: return jsonify({"error": "Missing body"}), 400

    email, password = data.get('Email'), data.get('Password')
    account = Account.query.filter_by(email=email).first()

    
    if not account or not bcrypt.check_password_hash(account.password, password):
        return jsonify({"error": "Invalid credentials"}), 401

    if not account.is_verified:
        return jsonify({"error": "Account pending verification"}), 403

    session.clear() 
    session['account_id'] = account.id 
    session['role'] = account.role
    session['email'] = account.email 
    session.permanent = True 
    
    return jsonify({
        "message": "Login successful",
        "role": account.role,
        "user": {
            "id": account.id,
            "role": account.role
        },
        "requires_password_update": account.is_temp_password 
    }), 200

@auth.route("/change_password", methods=["POST"])
def change_password():
    email = session.get("reset_email") or session.get("email")
    
    if not email:
        return jsonify({"error": "Unauthorized session"}), 401

    new_pass = request.json.get("NewPassword")
    if not new_pass: return jsonify({"error": "New password required"}), 400

    account = Account.query.filter_by(email=email).first()
    if not account: return jsonify({"error": "Account not found"}), 404

    account.password = bcrypt.generate_password_hash(new_pass).decode('utf-8')
    account.is_temp_password = False 
    db.session.commit()
    
    session['account_id'] = account.id
    session['role'] = account.role
    session['email'] = account.email
    session.permanent = True

    session.pop("reset_email", None) 
    
    return jsonify({"message": "Password updated successfully"}), 200

@auth.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out"}), 200

@auth.route("/forgot_password", methods=["POST"])
def forgot_password():
    email = request.json.get("Email")
    account = Account.query.filter_by(email=email).first()
    if not account: return jsonify({"error": "Email not found"}), 404

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
    email, otp_val = data.get("Email"), data.get("Otp")

    record = Otp.query.filter_by(email=email, otp=otp_val, used=False).first()
    if not record or datetime.now(timezone.utc) > record.expires_at.replace(tzinfo=timezone.utc):
        return jsonify({"error": "Invalid or expired OTP"}), 400

    record.used = True
    db.session.commit()
    
    session["reset_email"] = email 
    return jsonify({"message": "OTP verified"}), 200