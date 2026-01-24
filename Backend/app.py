import os
from flask import Flask
from flask_cors import CORS
from config import Config
from extension import db, mail
from routes import register_routes
from model import Account

app = Flask(__name__)
app.config.from_object(Config)
from flask_cors import CORS
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

db.init_app(app)
mail.init_app(app)

app.secret_key = app.config.get('SECRET_KEY', 'dev_key_only_change_in_production')
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] = False
app.config['SESSION_COOKIE_SAMESITE']='lax'

register_routes(app)

def initialize_system():
    with app.app_context():
        
        db.create_all()
        print("Database tables verified/created.")

       
        admin_email = os.getenv("ADMIN_EMAIL", "admin@system.com")
        admin_pass = os.getenv("ADMIN_PASSWORD", "admin123")
        
        admin_exists = Account.query.filter_by(email=admin_email).first()
        
        if not admin_exists:
            new_admin = Account(
                email=admin_email,
                password=admin_pass,
                role='Admin',
                is_temp_password=False,
                is_verified=True
            )
            db.session.add(new_admin)
            try:
                db.session.commit()
                print(f"Admin initialized: {admin_email}")
            except Exception as e:
                db.session.rollback()
                print(f"Failed to initialize admin: {e}")
        else:
            print("Admin account already present.")


initialize_system()

if __name__ == "__main__":
    app.run(debug=True, port=5000)