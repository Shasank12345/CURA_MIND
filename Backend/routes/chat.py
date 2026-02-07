from flask import Blueprint, request, jsonify
from flask import session as flask_session
from extension import db
from model import TriageSession, User
from .triage import run_triage_logic, gen_soap_note, RECOMMENDATIONS
from utilities import UI_DATA, calculate_age

chat = Blueprint('chat', __name__)

@chat.route('/message', methods=['POST', 'OPTIONS'])
def handle_chat():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "No data"}), 400

    acc_id = data.get("acc_id")
    raw_input = data.get("message", "")
    user_input = raw_input.strip().lower()

    user = User.query.filter_by(acc_id=acc_id).first()
    if not user:
        return jsonify({"reply": "User not found."}), 404

    # --- SESSION LOGIC ---
    # If the user is explicitly starting, we should invalidate old unfinished sessions
    if user_input == "start_triage":
        old_sessions = TriageSession.query.filter_by(user_id=user.id, final_flag=None).all()
        for old in old_sessions:
            old.final_flag = "ABANDONED" # Or just delete: db.session.delete(old)
        db.session.commit()
        session = None
    else:
        session = (
            TriageSession.query
            .filter_by(user_id=user.id, final_flag=None)
            .order_by(TriageSession.id.desc())
            .first()
        )

    # Create new session if none exists
    if not session:
        age = float(calculate_age(user.dob))
        session = TriageSession(user_id=user.id, v0_age=age)
        
        # Initialize all V-fields to None explicitly
        for q in UI_DATA:
            if q['id'] != "V0_AGE":
                setattr(session, q['id'].lower(), None)

        db.session.add(session)
        db.session.commit()
        db.session.refresh(session)
        print(f"--- NEW SESSION CREATED: ID {session.id} ---")

    # If it was just an initialization message, don't process it as an answer
    if user_input in ["", "start_triage"]:
        user_input = None

    # --- PEDIATRIC SHORTCUT ---
    if session.v0_age is not None and float(session.v0_age) < 18.0:
        pediatric_snapshot = {q['id']: 0 for q in UI_DATA}
        pediatric_snapshot['V0_AGE'] = float(session.v0_age)
        return finalize_session(session, "YELLOW", pediatric_snapshot)

    # --- ANSWER PROCESSING ---
    # Find the FIRST column that is still None
    current_q = None
    for q in UI_DATA:
        if q['id'] == "V0_AGE": continue
        if getattr(session, q['id'].lower()) is None:
            current_q = q
            break

    # Process answer ONLY if we have a question pending and a real user response
    if current_q and user_input is not None:
        is_yes = any(word in user_input for word in ['yes', 'yeah', 'yep', 'true', '1'])
        val = int(current_q['logic']['yes_value'] if is_yes else current_q['logic']['no_value'])

        setattr(session, current_q['id'].lower(), val)
        db.session.commit()

        # Immediate Exit Rule (RED FLAG)
        if current_q['id'] == "V1_ACCIDENT" and val == 1:
            red_snapshot = {q['id']: 0 for q in UI_DATA}
            red_snapshot['V0_AGE'] = float(session.v0_age)
            red_snapshot['V1_ACCIDENT'] = 1
            return finalize_session(session, "RED", red_snapshot)

    # --- NEXT QUESTION SELECTION ---
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

    # --- FINAL ASSESSMENT ---
    assessment_data = {q['id']: getattr(session, q['id'].lower()) for q in UI_DATA if q['id'] != "V0_AGE"}
    assessment_data['V0_AGE'] = float(session.v0_age)

    flag = run_triage_logic(assessment_data)
    return finalize_session(session, flag, assessment_data)

def finalize_session(triage_record, flag, data):
    print(f"--- ATTEMPTING FINALIZE: SESSION {triage_record.id} ---")

    try:
        triage_record.v1_accident  = int(data.get('V1_ACCIDENT', 0))
        triage_record.v2_walking   = int(data.get('V2_WALKING', 0))
        triage_record.v3_lateral   = int(data.get('V3_LATERAL', 0))
        triage_record.v3_medial    = int(data.get('V3_MEDIAL', 0))
        triage_record.v4_navicular = int(data.get('V4_NAVICULAR', 0))
        triage_record.v4_midfoot   = int(data.get('V4_MIDFOOT', 0))
        triage_record.v5_swelling  = int(data.get('V5_SWELLING', 0))
        triage_record.v6_stability = int(data.get('V6_STABILITY', 0))

        triage_record.final_flag = str(flag)

        soap = gen_soap_note(data, flag)
        triage_record.soap_s = str(soap.get('subjective', 'N/A'))
        triage_record.soap_o = str(soap.get('objective', 'N/A'))
        triage_record.soap_a = str(soap.get('assessment', 'N/A'))
        triage_record.soap_p = str(soap.get('plan', 'N/A'))

        db.session.commit()

        flask_session['last_triage_id'] = triage_record.id
        flask_session.modified = True

        specialty = "Orthopedics" if flag in ["RED", "YELLOW"] else "General"

        return jsonify({
            "status": "complete",
            "flag": flag,
            "triage_id": triage_record.id,
            "specialty": specialty,
            "content": RECOMMENDATIONS.get(flag),
            "reply": "Assessment complete. Analyzing results..."
        })

    except Exception as e:
        db.session.rollback()
        print(f"--- ERROR: {str(e)} ---")
        return jsonify({"error": "Failed to save triage"}), 500
