
from flask import Blueprint,jsonify,session,request
from model import User,Account,TriageSession,Consultation
from extension import db

user=Blueprint('/user',__name__)


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
        },
        "details": {
            "swelling": s.v5_swelling,
            "stability": s.v6_stability
        }
    } for s in sessions]), 200


@user.route('/consultation/request', methods=['POST'])
def request_consultation():
    # Use your existing session logic
    acc_id = session.get("account_id")
    if not acc_id:
        return jsonify({"error": "Login required"}), 401

    data = request.json
    doctor_id = data.get('doctor_id')
    triage_id = data.get('triage_id')

    if not doctor_id or not triage_id:
        return jsonify({"error": "Missing doctor or triage reference"}), 400

    # Retrieve the specific User Profile linked to this Account
    patient_profile = User.query.filter_by(acc_id=acc_id).first()
    if not patient_profile:
        return jsonify({"error": "User profile not found"}), 404

    # Create the consultation record
    new_request = Consultation(
        patient_id=patient_profile.id, # Foreign Key to user_profiles
        doctor_id=doctor_id,           # Foreign Key to doctor_profiles
        triage_id=triage_id,           # Foreign Key to triage_sessions
        status='pending'
    )

    try:
        db.session.add(new_request)
        db.session.commit()
        return jsonify({
            "message": "Request sent successfully",
            "consultation_id": new_request.id,
            "status": "pending"
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "details": str(e)}), 500
    

@user.route('/consultation/status/<int:consult_id>', methods=['GET'])
def check_consult_status(consult_id):
    consult = Consultation.query.get(consult_id)
    if not consult:
        return jsonify({"error": "Not found"}), 404
        
    return jsonify({
        "status": consult.status,
        "doctor_name": consult.triage_session.doctor.full_name if consult.status == 'accepted' else None
    }), 200