from flask import Blueprint, jsonify, session, request
from model import User, Account, TriageSession, Consultation, Doctor
from extension import db

user = Blueprint('user', __name__)

@user.route('/profile', methods=['GET'])
def get_profile():
    account_id = session.get('account_id')
    if not account_id:
        return jsonify({"error": "Unauthorized"}), 401

    user_data = db.session.query(User, Account).join(Account, User.acc_id == Account.id).filter(User.acc_id == account_id).first()

    if not user_data:
        return jsonify({"error": "Profile not found"}), 404

    profile, account = user_data
    return jsonify({
        "full_name": profile.full_name,
        "phone": profile.phone_number,
        "address": profile.address,
        "email": account.email,
        "role": account.role
    }), 200

@user.route('/triage_history', methods=['GET'])
def get_triage_history():
    account_id = session.get('account_id')
    profile = User.query.filter_by(acc_id=account_id).first()
    
    if not profile:
        return jsonify({"error": "Profile not found"}), 404

    sessions = TriageSession.query.filter_by(user_id=profile.id).order_by(TriageSession.created_at.desc()).all()
    
    return jsonify([{
        "id": s.id,
        "date": s.created_at.strftime('%Y-%m-%d %H:%M'),
        "result": s.final_flag,
        "soap": {
            "s": s.soap_s or "N/A",
            "o": s.soap_o or "N/A",
            "a": s.soap_a or "N/A",
            "p": s.soap_p or "N/A"
        }
    } for s in sessions]), 200

@user.route('/consultation/request', methods=['POST'])
def request_consultation():
    acc_id = session.get("account_id")
    if not acc_id:
        return jsonify({"error": "Login required"}), 401

    data = request.json
    try:
        doc_id = int(data.get('doctor_id'))
        trig_id = int(data.get('triage_id'))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid ID format"}), 400

    patient_profile = User.query.filter_by(acc_id=acc_id).first()
    if not patient_profile:
        return jsonify({"error": "User profile not found"}), 404

    new_request = Consultation(
        patient_id=patient_profile.id,
        doctor_id=doc_id,
        triage_id=trig_id,
        status='pending'
    )

    try:
        db.session.add(new_request)
        db.session.commit()
        return jsonify({
            "message": "Request sent", 
            "consultation_id": new_request.id 
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error"}), 500

@user.route('/consultation/status/<int:consult_id>', methods=['GET'])
def get_consult_status(consult_id):
    # 1. Check session
    acc_id = session.get("account_id")
    if not acc_id:
        print("DEBUG: No account_id in session")
        return jsonify({"error": "Unauthorized"}), 401

    # 2. Get patient profile
    patient = User.query.filter_by(acc_id=acc_id).first()
    if not patient:
        return jsonify({"error": "User profile not found"}), 404

    # 3. Find consultation specifically for this patient
    consult = Consultation.query.filter_by(id=consult_id, patient_id=patient.id).first()
    
    if not consult:
        return jsonify({"error": "Consultation not found"}), 404
        
    return jsonify({
        "status": consult.status,
        "doctor_name": consult.doctor.full_name if consult.doctor else "Doctor"
    }), 200