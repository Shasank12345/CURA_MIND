from flask import Blueprint, request, jsonify
from flask import session as flask_session
from extension import db
from model import TriageSession, User
from .triage import run_triage_logic, gen_soap_note, RECOMMENDATIONS 
from utilities import UI_DATA, calculate_age

chat = Blueprint('chat', __name__)

@chat.route('/message', methods=['POST', 'OPTIONS'])
def handle_chat():
    if request.method == 'OPTIONS': return '', 200

    data = request.get_json(silent=True)
    if not data: return jsonify({"error": "No data"}), 400

    acc_id = data.get("acc_id")
    user_input = data.get("message", "").strip().lower()

    user = User.query.filter_by(acc_id=acc_id).first()
    if not user: return jsonify({"reply": "User not found."}), 404

    session = TriageSession.query.filter_by(user_id=user.id, final_flag=None).order_by(TriageSession.id.desc()).first()
    
    if not session:
        age = float(calculate_age(user.dob))
        session = TriageSession(user_id=user.id, v0_age=age)

        for q in UI_DATA:
            if q['id'] == "V0_AGE": continue
            setattr(session, q['id'].lower(), None)
            
        db.session.add(session)
        db.session.commit()
        db.session.refresh(session)
        print(f"--- NEW SESSION CREATED: ID {session.id} ---")
    if session.v0_age is not None and float(session.v0_age) < 18.0:
        pediatric_snapshot = {
            'V0_AGE': float(session.v0_age),
            'V1_ACCIDENT': 0, 'V2_WALKING': 0, 'V3_LATERAL': 0, 
            'V3_MEDIAL': 0, 'V4_NAVICULAR': 0, 'V4_MIDFOOT': 0,
            'V5_SWELLING': 0, 'V6_STABILITY': 0
        }
        return finalize_session(session, "YELLOW", pediatric_snapshot)

    current_q = None
    for q in UI_DATA:
        if q['id'] == "V0_AGE": continue
        if getattr(session, q['id'].lower()) is None:
            current_q = q
            break
    if current_q and user_input != "":
        is_yes = any(word in user_input for word in ['yes', 'yeah', 'yep', 'true', '1'])
        val = int(current_q['logic']['yes_value'] if is_yes else current_q['logic']['no_value'])
        
        setattr(session, current_q['id'].lower(), val)
        db.session.commit()

        if current_q['id'] == "V1_ACCIDENT" and val == 1:
            return finalize_session(session, "RED", {
                'V1_ACCIDENT': 1, 'V0_AGE': float(session.v0_age),
                'V2_WALKING': 0, 'V3_LATERAL': 0, 'V3_MEDIAL': 0,
                'V4_NAVICULAR': 0, 'V4_MIDFOOT': 0, 'V5_SWELLING': 0, 'V6_STABILITY': 0
            })
    next_q = None
    for q in UI_DATA:
        if q['id'] == "V0_AGE": continue
        if getattr(session, q['id'].lower()) is None:
            next_q = q
            break

    if next_q:
        return jsonify({
            "status": "active",
            "reply": next_q['content']['question'],
            "helper": next_q['content']['helper'],
            "image": next_q['content']['image_key'],
            "step": next_q['id']
        })
    assessment_data = {q['id']: getattr(session, q['id'].lower()) for q in UI_DATA}
    assessment_data['V0_AGE'] = float(session.v0_age)
    
    flag = run_triage_logic(assessment_data)
    return finalize_session(session, flag, assessment_data)


def finalize_session(triage_record, flag, data):
    print(f"--- ATTEMPTING FINALIZE: SESSION {triage_record.id} ---")
    
    try:
        # Map the data to the model
        triage_record.v1_accident  = int(data.get('V1_ACCIDENT', 0))
        triage_record.v2_walking   = int(data.get('V2_WALKING', 0))
        triage_record.v3_lateral   = int(data.get('V3_LATERAL', 0))
        triage_record.v3_medial    = int(data.get('V3_MEDIAL', 0))
        triage_record.v4_navicular = int(data.get('V4_NAVICULAR', 0))
        triage_record.v4_midfoot   = int(data.get('V4_MIDFOOT', 0))
        triage_record.v5_swelling  = int(data.get('V5_SWELLING', 0)) 
        triage_record.v6_stability = int(data.get('V6_STABILITY', 0)) 
        
        triage_record.final_flag   = str(flag)
        soap = gen_soap_note(data, flag)
        triage_record.soap_s = str(soap.get('subjective', 'N/A'))
        triage_record.soap_o = str(soap.get('objective', 'N/A'))
        triage_record.soap_a = str(soap.get('assessment', 'N/A'))
        triage_record.soap_p = str(soap.get('plan', 'N/A'))

        db.session.commit()
        
        # Save to Flask Session for persistence across requests
        flask_session['last_triage_id'] = triage_record.id
        flask_session.modified = True

        # Logic to determine where they go next
        specialty = "Orthopedics" if flag in ["RED", "YELLOW"] else "General"
        
        return jsonify({
            "status": "complete",
            "flag": flag,
            "triage_id": triage_record.id, # MANDATORY for frontend
            "specialty": specialty,
            "content": RECOMMENDATIONS.get(flag),
            "reply": "Assessment complete. Analyzing results...",
            "redirect": "/userpannel/available-doctors" if flag == "YELLOW" else "/userpannel"
        })

    except Exception as e:
        db.session.rollback()
        print(f"--- ERROR: {str(e)} ---")
        return jsonify({"error": "Failed to save triage"}), 500