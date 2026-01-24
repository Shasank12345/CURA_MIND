from flask import Blueprint, jsonify, request, session
from extension import db
from model import Doctor, Account
doctor = Blueprint('doctor', __name__)

@doctor.route('/profile', methods=['GET'])
def profile():
    user_id = session.get("account_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    doc = Doctor.query.filter_by(acc_id=user_id).first()
    
    if not doc:
        return jsonify({"error": "Doctor profile not found"}), 404

    return jsonify({
        "full_name": doc.full_name,
        "phone": doc.phone_number,
        "specialization": doc.area_of_specialization,
        "license_no": doc.license_no,
        "bio": doc.bio_summary,
        "available": doc.is_available_online,
        "hospital": doc.hospital_name,
        "dob": str(doc.dob),
        "license_img": doc.license_img
    }), 200

@doctor.route('/update', methods=['PUT'])
def update():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    doc = Doctor.query.filter_by(acc_id=user_id).first()
    if not doc:
        return jsonify({"error": "Doctor profile not found"}), 404

    data = request.json
    if 'bio' in data: doc.bio_summary = data['bio']
    if 'available' in data: doc.is_available_online = data['available']
    if 'hospital' in data: doc.hospital_name = data['hospital']
    if 'phone' in data: doc.phone_number = data['phone']

    try:
        db.session.commit()
        return jsonify({"message": "Profile updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500