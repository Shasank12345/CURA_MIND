from extension import mail
from flask_mail import Message
from flask import current_app
import random, string

def gen_pass(length=5):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choices(chars, k=length))

def send_mail(email, content, is_rejection=False):
    if is_rejection:
        subject = "Update on your CuraMind Application"
        body = f"Hello,\n\n{content}\n\n- CuraMind Team"
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