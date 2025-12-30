import os
import random
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, session
from supabase import create_client
from extension import db
from model import Account, Doctor, User, Otp
from utilities import send_mail, gen_pass

auth = Blueprint('auth', __name__)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)

@auth.route('/sign_up', methods=['POST'])
def sign_up():
    data = request.form 
    role = data.get('role')
    email = data.get('Email')

    if not email or not role:
        return jsonify({"error": "Missing email or role"}), 400

    if Account.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    temp_password = gen_pass()
    is_verified = True if role == 'User' else False

    try:
        new_account = Account(
            email=email,
            password=temp_password, # Storing as plain text
            role=role,
            is_temp_password=True,
            is_verified=is_verified
        )
        db.session.add(new_account)
        db.session.flush()
        
        dob_str = data.get('DOB')
        dob_date = datetime.strptime(dob_str, '%Y-%m-%d').date() if dob_str else None

        if role == 'Doctor':
            file = request.files.get('licenseImage')
            if not file:
                return jsonify({"error": "Doctor license image required"}), 400
            
            file_bits = file.read()
            filename = f"doc_{new_account.id}_license.jpg"
            
            supabase_client.storage.from_('licenses').upload(
                path=filename,
                file=file_bits,
                file_options={"content-type": file.content_type}
            )

            image_url = supabase_client.storage.from_('licenses').get_public_url(filename)
            profile = Doctor(
                acc_id=new_account.id,
                full_name=data.get('Full_Name'),
                phone_number=data.get('Phone_Number'),
                area_of_specialization=data.get('Spec'),
                license_no=data.get('License_no'),
                dob=dob_date,
                license_img=image_url
            )
           
        else:
            profile = User(
                acc_id=new_account.id,
                full_name=data.get('Full_Name'),
                phone_number=data.get('Phone_Number'),
                address=data.get('Address'),
                dob=dob_date
            )
            send_mail(email, temp_password)

        db.session.add(profile)
        db.session.commit()
        return jsonify({"message": "Signup successful"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@auth.route('/login', methods=['POST'])
def login():
    data = request.json
    account = Account.query.filter_by(email=data.get('Email')).first()

    # Plain text comparison
    if not account or account.password != data.get('Password'):
        return jsonify({"error": "Invalid credentials"}), 401
    
    if not account.is_verified:
        return jsonify({"error": "Account pending verification"}), 403

    session.update({'user_id': account.id, 'email': account.email, 'role': account.role})
    return jsonify({"role": account.role, "first_login": account.is_temp_password}), 200

@auth.route("/change_password", methods=["POST"])
def change_password():
    email = session.get("email") or session.get("reset_email")
    if not email:
        return jsonify({"error": "Unauthorized"}), 401

    new_pass = request.json.get("NewPassword")
    account = Account.query.filter_by(email=email).first()
    
    account.password = new_pass # Updating as plain text
    account.is_temp_password = False
    db.session.commit()

    session.pop("reset_email", None)
    return jsonify({"message": "Password updated"}), 200

@auth.route("/forgot_password", methods=["POST"])
def forgot_password():
    email = request.json.get("Email")
    account = Account.query.filter_by(email=email).first()
    
    if not account:
        return jsonify({"error": "Email not found"}), 404

    # Generate a 6-digit OTP
    otp_code = str(random.randint(100000, 999999))
    expiry = datetime.utcnow() + timedelta(minutes=5)

    # Invalidate old unused OTPs for this email
    Otp.query.filter_by(email=email, used=False).update({"used": True})
    
    new_otp = Otp(email=email, otp=otp_code, expires_at=expiry)
    db.session.add(new_otp)
    db.session.commit()

    # Using the rejection flag in your utility to ensure correct email formatting
    send_mail(email, f"Your reset OTP is: {otp_code}", is_rejection=True)
    return jsonify({"message": "OTP sent"}), 200

@auth.route("/verify_otp", methods=["POST"])
def verify_otp():
    data = request.json
    email = data.get("Email")
    otp_val = data.get("Otp")

    record = Otp.query.filter_by(email=email, otp=otp_val, used=False).first()
    
    if not record or datetime.utcnow() > record.expires_at:
        return jsonify({"error": "Invalid or expired OTP"}), 400

    record.used = True
    db.session.commit()
    
    session["reset_email"] = email
    return jsonify({"message": "OTP verified"}), 200