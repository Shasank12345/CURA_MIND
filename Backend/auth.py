from flask import Blueprint, request, jsonify
from extension import db
from model import User, Doctor
from utilities import send_mail, gen_pass

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
            DOB=data.get('DOB')
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
            DOB=data.get('DOB')
        )

        db.session.add(new_user)
        db.session.commit()
        send_mail(new_user.Email, temp_password)

        return jsonify({"message": "User signed up successfully"}), 201

    else:
        return jsonify({"error": "Invalid role"}), 400
