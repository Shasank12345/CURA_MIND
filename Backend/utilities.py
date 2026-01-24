from extension import mail
from flask_mail import Message
from flask import current_app
import random, string
import os
import json
from datetime import datetime

current_dir = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(current_dir, 'data', 'ui_mapping.json')

def load_ui_data():
    try:
        if not os.path.exists(JSON_PATH):
       
            return {}
        with open(JSON_PATH, 'r') as f:
            data = json.load(f)
            print(f"SUCCESS: Loaded mapping from {JSON_PATH}")
            return data
    except Exception as e:
       
        print(f"CRITICAL ERROR: Failed to parse ui_mapping.json: {e}")
        return {}


UI_DATA = load_ui_data()
def calculate_age(dob):
    if not dob:
        return 0
    today = datetime.utcnow().date()
    years = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
    if years < 1:
        total_months = (today.year - dob.year) * 12 + (today.month - dob.month)
        if today.day < dob.day:
            total_months -= 1
        return round(total_months / 12, 2)
    
    return float(years)

UI_DATA = load_ui_data()

def gen_pass(length=5):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choices(chars, k=length))

def send_mail(email, content, is_rejection=False,doc=False):
    if is_rejection:
        subject = "Update on your CuraMind Application"
        body = f"Hello,\n\n{content}\n\n- CuraMind Team"

    elif  doc:
        subject ='Update on your CuraMind Application'
        body ='Your application has been received successfully. Please wait for the admin to verify it.'
    else:
        subject = "Your CuraMind Temporary Password"
        body = f"Hello!\n\nYour temporary password is: {content}\nPlease log in and change it immediately.\n\n- CuraMind Team"

    msg = Message(
        subject=subject,
        sender=current_app.config['MAIL_DEFAULT_SENDER'],
        recipients=[email],
        body=body
    )
    mail.send(msg)