from flask import Blueprint, jsonify, request, session
from extension import db
from model import Doctor, Account

doctor = Blueprint('doctor', __name__)

def get_auth_doctor():
    # Use the key set during your login process
    acc_id = session.get("account_id")
    if not acc_id:
        return None
    return Doctor.query.filter_by(acc_id=acc_id).first()

@doctor.route('/profile', methods=['GET'])
def profile():
    doc = get_auth_doctor()
    if not doc:
        return jsonify({"error": "Session Expired"}), 401
    
    acc = Account.query.get(doc.acc_id)
    return jsonify({
        "full_name": doc.full_name,
        "phone": doc.phone_number,
        "specialization": doc.area_of_specialization,
        "license_no": doc.license_no,
        "bio": doc.bio_summary,
        "available": doc.is_available_online, # Current DB Status
        "hospital": doc.hospital_name,
        "dob": str(doc.dob) if doc.dob else None,
        "license_img": doc.license_img,
        "email": acc.email if acc else ""
    }), 200

@doctor.route('/update', methods=['PUT'])
def update():
    doc = get_auth_doctor()
    if not doc:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Requirement: is_available triggered by doctor toggle
    if 'available' in data:
        doc.is_available_online = bool(data['available'])

    # Other Profile Updates
    if 'bio' in data: doc.bio_summary = data['bio']
    if 'hospital' in data: doc.hospital_name = data['hospital']
    if 'phone' in data: doc.phone_number = data['phone']

    try:
        db.session.commit()
        return jsonify({
            "message": "Update successful",
            "available": doc.is_available_online 
        }), 200
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Database Error"}), 500
    
@doctor.route('/available', methods=['GET'])
def get_available_doctors():
    specialty = request.args.get('specialty')
    
    # Start with all online doctors
    query = Doctor.query.filter_by(is_available_online=True)
    
    # Apply filter ONLY if specialty is provided
    if specialty:
        query = query.filter(Doctor.area_of_specialization.ilike(f"%{specialty}%"))
        
    available_docs = query.all()

    return jsonify([{
        "id": doc.acc_id,
        "name": doc.full_name,
        "specialization": doc.area_of_specialization,
        "hospital": doc.hospital_name,
        # "photo": doc.license_img # Or a specific photo field if you have one
    } for doc in available_docs]), 200