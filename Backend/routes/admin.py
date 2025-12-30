from flask import Blueprint, request, jsonify, session
from extension import db
from model import Account, Doctor
from utilities import send_mail, gen_pass

admin = Blueprint('admin', __name__, url_prefix='/admin')

@admin.route('/dashboard_stats', methods=['GET'])
def dashboard_stats():
    if session.get('role') != 'Admin':
        return jsonify({"error": "Unauthorized"}), 403
    
    pending = Account.query.filter_by(role='Doctor', is_verified=False).count()
    verified = Account.query.filter_by(role='Doctor', is_verified=True).count()
    patients = Account.query.filter_by(role='User').count()

    return jsonify({
        "pending_verifications": pending,
        "total_doctors": verified,
        "total_patients": patients
    }), 200

@admin.route('/get_doctors/<string:status>', methods=['GET'])
def get_doctors(status):
    if session.get('role') != 'Admin':
        return jsonify({"error": "Unauthorized"}), 403
    
    is_verified = True if status == 'verified' else False
    
    docs = db.session.query(Account, Doctor).join(
        Doctor, Account.id == Doctor.acc_id
    ).filter(Account.is_verified == is_verified).all()

    return jsonify([{
        "id": acc.id,
        "name": doc.full_name,
        "email": acc.email,
        "licenseNo": doc.license_no,
        "specialization": doc.area_of_specialization, 
        "phone": doc.phone_number,
        "licenseImage": doc.license_img
    } for acc, doc in docs]), 200

@admin.route('/handle_request/<int:acc_id>', methods=['POST'])
def handle_request(acc_id):
    if session.get('role') != 'Admin':
        return jsonify({"error": "Unauthorized"}), 403
    
    data = request.json
    action = data.get('action')
    account = Account.query.get(acc_id)
    
    if not account: 
        return jsonify({"error": "Account not found"}), 404

    try:
        if action == 'verify':
            temp_pwd = gen_pass()
            # Storing as plain text per your request
            account.password = temp_pwd
            account.is_verified = True
            
            # Send mail using the verification template (is_rejection=False)
            send_mail(account.email, temp_pwd)
            
            db.session.commit()
            return jsonify({"message": "Doctor Verified"}), 200
        
        elif action == 'reject':
            reason = data.get('reason', 'Documents unclear')
            note = data.get('note', '')
            
            rejection_text = f"Your application was rejected. Reason: {reason}. {note}"
            # Send mail using the rejection template (is_rejection=True)
            send_mail(account.email, rejection_text, is_rejection=True)
            
            db.session.delete(account)
            db.session.commit()
            return jsonify({"message": "Application rejected"}), 200
            
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500