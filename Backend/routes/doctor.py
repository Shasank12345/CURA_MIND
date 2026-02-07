from flask import Blueprint, jsonify, request, session
from extension import db
import os
from model import Doctor, Account, TriageSession, Consultation, User

doctor = Blueprint('doctor', __name__)

def get_auth_doctor():
    acc_id = session.get("account_id")
    if not acc_id:
        return None
    return Doctor.query.filter_by(acc_id=acc_id).first()

@doctor.route('/profile', methods=['GET'])
def profile():
    doc = get_auth_doctor()
    if not doc:
        return jsonify({"error": "Unauthorized"}), 401

    # 1. Pull base configuration from .env
    supabase_url = os.getenv("SUPABASE_URL")
    if supabase_url:
        supabase_url = supabase_url.rstrip('/')
    
    bucket_name = "licenses" # Ensure this matches your Supabase bucket name
    
    # 2. Fix the URL Nesting Logic
    raw_path = doc.license_img
    license_url = None

    if raw_path:
        # If the DB already contains 'http://...', use it directly
        if raw_path.startswith('http'):
            license_url = raw_path
        else:
            # If DB contains 'doc_3.jpeg', construct the URL
            # Format: https://project.supabase.co/storage/v1/object/public/bucket/file
            license_url = f"{supabase_url}/storage/v1/object/public/{bucket_name}/{raw_path.lstrip('/')}"

    # 3. Get associated Account info for email
    acc = Account.query.get(doc.acc_id)
    
    # 4. Return the cleaned data
    return jsonify({
        "full_name": doc.full_name,
        "available": doc.is_available_online,
        "specialization": doc.area_of_specialization,
        "hospital": doc.hospital_name,
        "email": acc.email if acc else "N/A",
        "phone": doc.phone_number,
        "license_no": doc.license_no,
        "dob": doc.dob.strftime("%Y-%m-%d") if doc.dob else "N/A",
        "bio": doc.bio_summary,
        "license_img": license_url  # This will now be a valid, single URL
    }), 200

@doctor.route('/update', methods=['PUT'])
def update_status():
    from flask import request
    doc = get_auth_doctor()
    if not doc:
        return jsonify({"error": "Unauthorized"}), 401
    
    data = request.get_json()
    
    # The 'is_available' status is triggered by the doctor from their profile
    if 'available' in data:
        doc.is_available_online = data['available']
        db.session.commit() # Update in the database upon toggling
        
    return jsonify({
        "message": "Status updated",
        "available": doc.is_available_online
    }), 200
@doctor.route('/update', methods=['PUT'])
def update():
    doc = get_auth_doctor()
    if not doc:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    if 'available' in data:
        doc.is_available_online = bool(data['available'])
    if 'bio' in data: 
        doc.bio_summary = data['bio']
    if 'phone' in data: 
        doc.phone_number = data['phone']

    try:
        db.session.commit()
        return jsonify({"message": "Success", "available": doc.is_available_online}), 200
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Database Error"}), 500

@doctor.route('/available', methods=['GET'])
def get_available_doctors():
    query = Doctor.query.filter_by(is_available_online=True)
    specialty = request.args.get('specialty')
    if specialty:
        query = query.filter(Doctor.area_of_specialization.ilike(f"%{specialty}%"))
    
    doctors = query.all()
    return jsonify([{
        "id": d.id,
        "name": d.full_name,
        "specialization": d.area_of_specialization,
        "hospital": d.hospital_name,
        "photo": getattr(d, 'profile_photo', None) 
    } for d in doctors]), 200

@doctor.route('/consultations', methods=['GET'])
def get_all_consultations():
    doc = get_auth_doctor()
    if not doc:
        return jsonify({"error": "Unauthorized"}), 401
    
    results = db.session.query(Consultation, TriageSession, User)\
        .join(TriageSession, Consultation.triage_id == TriageSession.id)\
        .join(User, Consultation.patient_id == User.id)\
        .filter(Consultation.doctor_id == doc.id).all()

    return jsonify([{
        "id": c.id,
        "patient_name": u.full_name,
        "triage_result": t.final_flag,
        "status": c.status,
        "date": c.created_at.strftime("%b %d")
    } for c, t, u in results]), 200

@doctor.route('/consultation/<int:consult_id>', methods=['GET'])
def get_consultation(consult_id):
    doc = get_auth_doctor()
    if not doc:
        return jsonify({"error": "Unauthorized"}), 401
    
    result = db.session.query(Consultation, TriageSession, User)\
        .join(TriageSession, Consultation.triage_id == TriageSession.id)\
        .join(User, Consultation.patient_id == User.id)\
        .filter(Consultation.id == consult_id, Consultation.doctor_id == doc.id).first()

    if not result:
        return jsonify({"error": "Not found"}), 404

    c, t, u = result
    return jsonify({
        "patient_name": u.full_name,
        "triage_result": t.final_flag,
        "soap": {"s": t.soap_s, "o": t.soap_o, "a": t.soap_a, "p": t.soap_p}
    }), 200

@doctor.route('/consultation/<int:consult_id>/respond', methods=['POST'])
def respond(consult_id):
    doc = get_auth_doctor()
    if not doc:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    status = data.get('status') # Frontend MUST send 'accepted' or 'rejected'

    consult = Consultation.query.filter_by(id=consult_id, doctor_id=doc.id).first()
    if not consult:
        return jsonify({"error": "Consultation not found"}), 404

    consult.status = status
    try:
        db.session.commit()
        return jsonify({"message": f"Consultation {status}", "status": status}), 200
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Update failed"}), 500