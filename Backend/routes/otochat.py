from flask import Blueprint, request, jsonify, session
from extension import db
from model import Message, Consultation
from datetime import datetime, timezone

otochat = Blueprint('otochat', __name__)

@otochat.route('/messages/<int:cons_id>', methods=['GET'])
def get_messages(cons_id):
    acc_id = session.get('account_id')
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
            "sender_id": m.sender_id, # This MUST match userData.id in React
            "content": m.content,
            "timestamp": m.timestamp.strftime('%H:%M')
        } for m in messages]
    }), 200

@otochat.route('/send', methods=['POST'])
def send_message():
    acc_id = session.get('account_id')
    if not acc_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    cons_id = data.get('consultationId')
    content = data.get('content')

    new_msg = Message(
        consultation_id=cons_id,
        sender_id=acc_id, # Saving the account_id from session
        content=content,
        timestamp=datetime.now(timezone.utc)
    )
    
    db.session.add(new_msg)
    db.session.commit()
    return jsonify({"success": True}), 201