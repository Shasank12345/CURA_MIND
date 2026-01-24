
from flask import Blueprint,jsonify,session
from model import User,Account,TriageSession
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