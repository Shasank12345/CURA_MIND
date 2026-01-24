from flask import Blueprint, request, jsonify, session
from extension import db
from model import Account, Doctor,TriageSession,User
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
    docs = db.session.query(Account, Doctor).outerjoin(
        Doctor, Account.id == Doctor.acc_id
    ).filter(Account.role == 'Doctor', Account.is_verified == is_verified).all()

    return jsonify([{
        "id": acc.id, # This is the Account ID
        "name": doc.full_name if doc else "Unknown",
        "email": acc.email,
        "licenseNo": doc.license_no if doc else "N/A",
        "specialization": doc.area_of_specialization if doc else "N/A", 
        "phone": doc.phone_number if doc else "N/A",
        "licenseImage": doc.license_img if doc else None
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
            account.password = temp_pwd
            account.is_verified = True
            send_mail(account.email, temp_pwd)
            db.session.commit()
            return jsonify({"message": "Doctor Verified"}), 200
        
        elif action == 'reject':
            reason = data.get('reason', 'Documents unclear')
            note = data.get('note', '')
            rejection_text = f"Your application was rejected. Reason: {reason}. {note}"
            send_mail(account.email, rejection_text, is_rejection=True)
            
            # CRITICAL: Delete Doctor profile first to avoid Foreign Key errors
            Doctor.query.filter_by(acc_id=acc_id).delete()
            db.session.delete(account)
            db.session.commit()
            return jsonify({"message": "Application rejected"}), 200
            
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Include history and detail routes here as previously optimized
@admin.route('/triage-history', methods=['GET'])
def get_triage_history():
    """Fetches the list for the sidebar."""
    try:
        # Join ensures we only get sessions that have an associated user profile
        results = db.session.query(TriageSession, User).join(
            User, TriageSession.user_id == User.id
        ).all()
        
        return jsonify([{
            "session_id": s.id,
            "patient_name": u.full_name,
            "acc_id": u.acc_id,
            "flag": s.final_flag,
            "timestamp": s.created_at.isoformat()
        } for s, u in results]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin.route('/triage-detail/<int:session_id>', methods=['GET'])
def get_triage_detail(session_id):
    """Fetches the full report for the right pane."""
    try:
        session = TriageSession.query.get(session_id)
        if not session:
            return jsonify({"error": "Session record missing"}), 404
        user = User.query.filter((User.id == session.user_id) | (User.acc_id == session.user_id)).first()
        
        if not user:
            return jsonify({"error": "User profile not found for this session"}), 404

        return jsonify({
            "patient_info": {
                "name": user.full_name,
                "acc_id": user.acc_id,
                "dob": user.dob.isoformat() if user.dob else "N/A"
            },
            "clinical_data": {
                "age": session.v0_age,
                "v1_accident": session.v1_accident,
                "v2_walking": session.v2_walking,
                "v3_lateral": session.v3_lateral,
                "v4_medial": session.v3_medial,
                "v5_navicular": session.v4_navicular,
                "v6_midfoot": session.v4_midfoot,
                "v7_swelling": session.v5_swelling,
                "v8_stability": session.v6_stability
            },
            "soap": {
                "s": session.soap_s or "N/A",
                "o": session.soap_o or "N/A",
                "a": session.soap_a or "N/A",
                "p": session.soap_p or "N/A"
            },
            "flag": session.final_flag,
            "timestamp": session.created_at.isoformat()
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500