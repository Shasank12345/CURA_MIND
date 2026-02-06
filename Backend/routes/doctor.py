from flask import Blueprint, jsonify, request, session
from extension import db
from model import Doctor, Account, TriageSession, Consultation, User

doctor = Blueprint('doctor', __name__)

def get_auth_doctor():
    # Primary check: account_id from session
    acc_id = session.get("account_id")
    if not acc_id:
        return None
    return Doctor.query.filter_by(acc_id=acc_id).first()

@doctor.route('/profile', methods=['GET'])
def profile():
    doc = get_auth_doctor()
    if not doc:
        return jsonify({"error": "Unauthorized"}), 401
    
    acc = Account.query.get(doc.acc_id)
    return jsonify({
        "full_name": doc.full_name,
        "available": doc.is_available_online,
        "specialization": doc.area_of_specialization,
        "hospital": doc.hospital_name,
        "email": acc.email if acc else ""
    }), 200

# Unified Toggle & Update Route
@doctor.route('/update', methods=['PUT'])
def update():
    doc = get_auth_doctor()
    if not doc:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Handles the availability toggle from the dashboard
    if 'available' in data:
        doc.is_available_online = bool(data['available'])

    if 'bio' in data: doc.bio_summary = data['bio']
    if 'phone' in data: doc.phone_number = data['phone']

    try:
        db.session.commit()
        return jsonify({"message": "Success", "available": doc.is_available_online}), 200
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Database Error"}), 500

@doctor.route('/consultations', methods=['GET'])
def get_all_consultations():
    doc = get_auth_doctor()
    if not doc:
        return jsonify({"error": "Unauthorized"}), 401
    
    results = db.session.query(
        Consultation, TriageSession, User
    ).join(TriageSession, Consultation.triage_id == TriageSession.id
    ).join(User, Consultation.patient_id == User.id
    ).filter(Consultation.doctor_id == doc.id).all()

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
    
    result = db.session.query(
        Consultation, TriageSession, User
    ).join(TriageSession, Consultation.triage_id == TriageSession.id
    ).join(User, Consultation.patient_id == User.id
    ).filter(Consultation.id == consult_id, Consultation.doctor_id == doc.id).first()

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
    consult = Consultation.query.filter_by(id=consult_id, doctor_id=doc.id).first()
    
    if not consult:
        return jsonify({"error": "Consultation not found"}), 404

    consult.status = data.get('status')
    db.session.commit()
    return jsonify({"message": "Updated", "status": consult.status}), 200