from flask import Blueprint, request, jsonify, session
from extension import db
from model import Message, Consultation, Doctor, Account # Fixed import name consistency
from datetime import datetime, timezone

otochat = Blueprint('otochat', __name__)

# Helper to check session consistently
def get_current_acc_id():
    # Use 'account_id' everywhere. DO NOT mix with 'user_id'.
    return session.get('account_id')

@otochat.route('/messages/<int:cons_id>', methods=['GET'])
def get_messages(cons_id):
    acc_id = get_current_acc_id()
    if not acc_id:
        return jsonify({"error": "Unauthorized"}), 401

    cons = Consultation.query.get(cons_id)
    if not cons:
        return jsonify({"error": "Consultation not found"}), 404

    messages = Message.query.filter_by(consultation_id=cons_id).order_by(Message.timestamp.asc()).all()
    
    return jsonify({
        "status": cons.status,
        "messages": [{
            "id": m.id,
            "sender_id": m.sender_id, 
            "content": m.content,
            "timestamp": m.timestamp.strftime('%H:%M')
        } for m in messages]
    }), 200

@otochat.route('/send', methods=['POST'])
def send_message():
    acc_id = get_current_acc_id()
    if not acc_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    cons_id = data.get('consultationId')
    content = data.get('content')

    # Security Check: Prevent sending messages to closed chats
    cons = Consultation.query.get(cons_id)
    if not cons or cons.status == 'completed':
        return jsonify({"error": "Consultation is closed"}), 403

    new_msg = Message(
        consultation_id=cons_id,
        sender_id=acc_id,
        content=content,
        timestamp=datetime.now(timezone.utc)
    )
    
    db.session.add(new_msg)
    db.session.commit()
    return jsonify({"success": True}), 201

@otochat.route('/end', methods=['POST'])
def end_session():
    acc_id = get_current_acc_id()
    if not acc_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    cons_id = data.get('consultationId')
    summary = data.get('summary')

    if not cons_id or not summary:
        return jsonify({"error": "Missing consultation ID or summary"}), 400

    cons = Consultation.query.get(cons_id)
    if not cons:
        return jsonify({"error": "Consultation not found"}), 404

    # Ensure only the assigned doctor can end it
    doctor_profile = Doctor.query.filter_by(acc_id=acc_id).first()
    if not doctor_profile or cons.doctor_id != doctor_profile.id:
        return jsonify({"error": "Only the assigned doctor can end this session"}), 403

    try:
        cons.status = 'completed'
        cons.clinical_summary = summary
        cons.ended_at = datetime.now(timezone.utc)

        # Restoration of availability
        doctor_profile.is_available_online = True
        
        db.session.commit()
        return jsonify({"message": "Consultation finalized successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
@otochat.route('/respond/<int:cons_id>', methods=['POST'])
def respond_to_consultation(cons_id):
    acc_id = get_current_acc_id()
    if not acc_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    action = data.get('action') # 'accepted' or 'rejected'

    cons = Consultation.query.get(cons_id)
    if not cons:
        return jsonify({"error": "Consultation not found"}), 404

    # Fetch doctor profile to verify ownership and update availability
    doctor = Doctor.query.filter_by(acc_id=acc_id).first()
    if not doctor:
        return jsonify({"error": "Doctor profile not found"}), 403

    if action == 'accepted':
        cons.status = 'accepted'
        cons.doctor_id = doctor.id
        # Doctor is now busy with a patient
        doctor.is_available_online = False 
    elif action == 'rejected':
        cons.status = 'rejected'
    else:
        return jsonify({"error": "Invalid action"}), 400

    try:
        db.session.commit()
        return jsonify({
            "status": cons.status,
            "message": f"Consultation {action} successfully"
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500