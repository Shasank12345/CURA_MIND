from flask import Blueprint, jsonify, session, request
from model import User, Account, TriageSession, Consultation, Doctor
from extension import db

user = Blueprint('user', __name__)

def get_current_user():
    """Internal helper to retrieve the User profile via session."""
    acc_id = session.get('account_id')
    if not acc_id:
        return None
    return User.query.filter_by(acc_id=acc_id).first()

@user.route('/profile', methods=['GET'])
def get_profile():
    acc_id = session.get('account_id')
    if not acc_id:
        return jsonify({"error": "Unauthorized"}), 401

    # Single query join to get both account and profile data
    data = db.session.query(User, Account).join(Account, User.acc_id == Account.id).filter(User.acc_id == acc_id).first()

    if not data:
        return jsonify({"error": "Profile not found"}), 404

    profile, account = data
    return jsonify({
        "full_name": profile.full_name,
        "phone": profile.phone_number,
        "address": profile.address,
        "email": account.email,
        "role": account.role
    }), 200

@user.route('/dashboard_unified_history', methods=['GET'])
def get_unified_history():
    patient = get_current_user()
    if not patient:
        return jsonify({"error": "Unauthorized"}), 401

    # Optimized join to fetch triage sessions and their associated consultations/doctors
    results = db.session.query(TriageSession, Consultation, Doctor)\
        .outerjoin(Consultation, TriageSession.id == Consultation.triage_id)\
        .outerjoin(Doctor, Consultation.doctor_id == Doctor.id)\
        .filter(TriageSession.user_id == patient.id)\
        .order_by(TriageSession.created_at.desc()).all()

    return jsonify([{
        "id": triage.id,
        "date": triage.created_at.strftime('%d %b %Y | %H:%M'),
        "result": triage.final_flag,
        "triage_soap": {
            "s": triage.soap_s or "N/A", 
            "o": triage.soap_o or "N/A",
            "a": triage.soap_a or "N/A", 
            "p": triage.soap_p or "N/A"
        },
        "clinical_summary": consult.clinical_summary if (consult and consult.status == 'completed') else None,
        "doctor_name": doc.full_name if doc else "N/A",
        "consult_status": consult.status if consult else "none"
    } for triage, consult, doc in results]), 200

@user.route('/consultation/request', methods=['POST', 'OPTIONS'])
def request_consultation():
    # CORS Preflight handling
    if request.method == "OPTIONS":
        return "", 200

    acc_id = session.get("account_id")
    if not acc_id:
        return jsonify({"error": "Login required"}), 401

    data = request.json
    try:
        doc_id = int(data.get('doctor_id'))
        trig_id = int(data.get('triage_id'))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid ID format"}), 400

    patient = get_current_user()
    if not patient:
        return jsonify({"error": "User profile not found"}), 404

    # Prevent duplicate pending requests for the same triage session
    existing = Consultation.query.filter_by(triage_id=trig_id, status='pending').first()
    if existing:
        return jsonify({"error": "Request already pending for this session"}), 409

    new_request = Consultation(
        patient_id=patient.id,
        doctor_id=doc_id,
        triage_id=trig_id,
        status='pending'
    )

    try:
        db.session.add(new_request)
        db.session.commit()
        return jsonify({"message": "Request sent", "consultation_id": new_request.id}), 201
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Database error"}), 500

@user.route('/consultation/status/<int:consult_id>', methods=['GET'])
def get_consult_status(consult_id):
    patient = get_current_user()
    if not patient:
        return jsonify({"error": "Unauthorized"}), 401

    consult = Consultation.query.filter_by(id=consult_id, patient_id=patient.id).first()
    if not consult:
        return jsonify({"error": "Consultation not found"}), 404
        
    return jsonify({
        "status": consult.status,
        "doctor_name": consult.doctor.full_name if consult.doctor else "Doctor"
    }), 200