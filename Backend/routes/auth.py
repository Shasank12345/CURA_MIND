from flask import Blueprint, request, jsonify, session
from extension import db
from model import User, Doctor, Otp
from utilities import send_mail, gen_pass
from datetime import datetime, timedelta
import random

auth = Blueprint('_auth_', __name__)

@auth.route('/sign_up', methods=['POST'])
def sign_up():
    data = request.json
    role = data.get('role')
    if not role:
        return jsonify({"error": "Role not specified"}), 400

    temp_password = gen_pass()

    if role == 'Doctor':
        license_no = data.get('License_no')
        if not license_no:
            return jsonify({"error": "Doctor license number required"}), 400
        if Doctor.query.filter_by(Email=data.get('Email')).first():
            return jsonify({"error": "Email already exists"}), 409

        doctor = Doctor(
            Full_Name=data.get('Full_Name'),
            Email=data.get('Email'),
            Password=temp_password,
            Phone_Number=data.get('Phone_Number'),
            Area_of_Specialization=data.get('Spec'),
            License_no=license_no,
            DOB=data.get('DOB'),
            is_temp_password=True
        )
        db.session.add(doctor)
        db.session.commit()
        send_mail(doctor.Email, temp_password)
        return jsonify({"message": "Doctor signed up successfully"}), 201

    elif role == 'User':
        if User.query.filter_by(Email=data.get('Email')).first():
            return jsonify({"error": "Email already exists"}), 409

        new_user = User(
            Full_Name=data.get('Full_Name'),
            Email=data.get('Email'),
            Password=temp_password,
            Phone_Number=data.get('Phone_Number'),
            Address=data.get('Address'),
            DOB=data.get('DOB'),
            is_temp_password=True
        )
        db.session.add(new_user)
        db.session.commit()
        send_mail(new_user.Email, temp_password)
        return jsonify({"message": "User signed up successfully"}), 201
    else:
        return jsonify({"error": "Invalid role"}), 400

@auth.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('Email')
    password = data.get('Password')

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = Doctor.query.filter_by(Email=email, Password=password).first()
    role = "Doctor"
    if not user:
        user = User.query.filter_by(Email=email, Password=password).first()
        role = "User"

    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    session['email'] = email
    session['role'] = role

    return jsonify({
        "message": "Login successful",
        "role": role,
        "email": email,
        "first_login": user.is_temp_password
    }), 200

@auth.route("/change_password", methods=["POST"])
def change_password():
    email = session.get("email") or session.get("reset_email")
    if not email:
        return jsonify({"error": "User not logged in or OTP not verified"}), 401

    data = request.json
    new_password = data.get("NewPassword")
    if not new_password:
        return jsonify({"error": "New password is required"}), 400

    user = Doctor.query.filter_by(Email=email).first() or User.query.filter_by(Email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.Password = new_password
    user.is_temp_password = False
    db.session.commit()

    if "reset_email" in session:
        session.pop("reset_email", None)

    return jsonify({"message": "Password changed successfully"}), 200

@auth.route("/forgot_password", methods=["POST"])
def forgot_password():
    data = request.json
    email = data.get("Email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = Doctor.query.filter_by(Email=email).first() or User.query.filter_by(Email=email).first()
    if not user:
        return jsonify({"error": "Email not registered"}), 404

    otp = str(random.randint(100000, 999999))
    expiry = datetime.utcnow() + timedelta(minutes=2)
    old_otps = Otp.query.filter_by(email=email, used=False).all()
    for o in old_otps:
        o.used = True
    db.session.commit()

    new_otp = Otp(
        email=email,
        otp=otp,
        expires_at=expiry,
        used=False
    )
    db.session.add(new_otp)
    db.session.commit()

    send_mail(email, f"Your OTP is: {otp}")

    return jsonify({"message": "OTP sent to your email"}), 200


@auth.route("/verify_otp", methods=["POST"])
def verify_otp():
    data = request.json
    email = data.get("Email")
    otp = data.get("Otp")

    if not email or not otp:
        return jsonify({"error": "Email and OTP are required"}), 400

    record = Otp.query.filter_by(email=email, otp=otp, used=False).first()
    if not record:
        return jsonify({"error": "Invalid OTP"}), 400

    if datetime.utcnow() > record.expires_at:
        record.used = True
        db.session.commit()
        return jsonify({"error": "OTP expired"}), 400

    record.used = True
    db.session.commit()

    session["reset_email"] = email

    return jsonify({"message": "OTP verified successfully"}), 200
