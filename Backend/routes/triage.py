from flask import Blueprint, jsonify, request

triage = Blueprint('triage', __name__)

RECOMMENDATIONS = {
    "RED": {
        "title": "EMERGENCY CARE REQUIRED",
        "text": "High risk of fracture detected. Inability to bear weight or bone tenderness requires immediate X-ray imaging at a Trauma Center.",
        "emergency_numbers": [
            {"label": "Ambulance (Nepal Red Cross)", "number": "102"},
            {"label": "Police", "number": "100"}
        ],
        "cta_label": "Call Ambulance (102)",
        "show_doctors": False,
        "color_code": "#EE3E3E",
        "priority": 1
    },
    "YELLOW": {
        "title": "Urgent Specialist Review",
        "text": "Symptoms suggest potential ligamentous injury or age-related risks (Pediatric/Geriatric). Specialist review recommended.",
        "cta_label": "Book Orthopedist",
        "show_doctors": True,
        "color_code": "#E7E13B",
        "priority": 2
    },
    "GREEN": {
        "title": "Home Care (RICE)",
        "text": "Low risk of fracture. Follow Rest, Ice, Compression, and Elevation (RICE) for 48 hours.",
        "cta_label": "View Recovery Guide",
        "show_doctors": False,
        "color_code": "#10B981",
        "priority": 3
    }
}

def gen_soap_note(res, flag):
    age = res.get('V0_AGE', 'Unknown')
    is_high_impact = str(res.get('V1_ACCIDENT')) == '1'
    trauma = "High-Impact" if is_high_impact else "Low-impact"
    
    s = f"Subjective: Patient ({age}y) reports {trauma} injury to the ankle."

    findings = []
    mapping = {
        'V2_WALKING': "Inability to bear weight",
        'V3_LATERAL': "Lateral Malleolus tenderness",
        'V3_MEDIAL': "Medial Malleolus tenderness",
        'V4_MIDFOOT': "Base of 5th Metatarsal tenderness",
        'V4_NAVICULAR': "Navicular bone tenderness"
    }
    
    for key, desc in mapping.items():
        if str(res.get(key)) == '1':
            findings.append(desc)
    
    o = "Objective: Exam Findings: " + (", ".join(findings) if findings else "No focal bone tenderness noted.")
    a = f"Assessment: {flag} status. Ottawa Ankle Rules {'Positive' if flag == 'RED' else 'Negative/Inconclusive'}."

    if flag == "RED":
        p = "Plan: Immediate referral to the nearest Trauma Center (Nepal) for radiographic imaging (X-ray)."
    elif flag == "YELLOW":
        p = "Plan: Orthopedic specialist consultation for joint stability evaluation and ligamentous assessment."
    else:
        p = "Plan: Home management via RICE protocol. Patient to monitor for increased pain or neurovascular changes."

    return {"subjective": s, "objective": o, "assessment": a, "plan": p}

def run_triage_logic(res):
    try:
        age = float(res.get('V0_AGE', 30))
    except (ValueError, TypeError):
        age = 30.0

   
    if age < 1.0 or str(res.get('V1_ACCIDENT')) == '1':
        return 'RED'
    ottawa_red_keys = ['V2_WALKING', 'V3_LATERAL', 'V3_MEDIAL', 'V4_MIDFOOT', 'V4_NAVICULAR']
    if any(str(res.get(k)) == '1' for k in ottawa_red_keys):
        return 'RED'

    
    yellow_keys = ['V5_SWELLING', 'V6_STABILITY']
    if (age < 18.0 or age > 55.0) or any(str(res.get(k)) == '1' for k in yellow_keys):
        return "YELLOW"

    return "GREEN"

@triage.route('/evaluate', methods=['POST'])
def evaluate():
    responses = request.get_json(silent=True)
    if not responses:
        return jsonify({"status": "error", "message": "No triage data provided"}), 400
    
    flag = run_triage_logic(responses)
    soap = gen_soap_note(responses, flag)
    
    return jsonify({
        "status": "success",
        "flag": flag,
        "content": RECOMMENDATIONS.get(flag),
        "soap": soap
    })