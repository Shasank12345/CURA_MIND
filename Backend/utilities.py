from extension import mail
from flask_mail import Message
from flask import current_app
import random, string

def gen_pass(length=20):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choices(chars, k=length))

def send_mail(email, temp_pass):
    msg = Message(
        subject="Your CuraMind Temporary Password",
        sender=current_app.config['MAIL_DEFAULT_SENDER'],
        recipients=[email],
        body=f"Hello!\n\nYour temporary password is: {temp_pass}\nPlease log in and change it immediately.\n\n-CuraMind Team"
    )
    mail.send(msg)
