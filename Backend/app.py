import os
from flask import Flask
from flask_cors import CORS
from config import Config
from extension import db, mail, bcrypt
from routes import register_routes
from model import Account

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, 
         supports_credentials=True, 
         origins=["http://localhost:5173"],
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

    app.secret_key = app.config.get('SECRET_KEY', 'dev_key_only_change_in_production')
    app.config.update(
        SESSION_COOKIE_SAMESITE='Lax',  
        SESSION_COOKIE_SECURE=False,   
        SESSION_COOKIE_HTTPONLY=True,
        PERMANENT_SESSION_LIFETIME=3600
    )


    db.init_app(app)
    mail.init_app(app)
    bcrypt.init_app(app)
    register_routes(app)

    return app

app = create_app()

def initialize_system():
    with app.app_context():
        db.create_all()
        print("Database tables verified/created.")

        admin_email = os.getenv("ADMIN_EMAIL", "admin@system.com")
        admin_pass = os.getenv("ADMIN_PASSWORD", "admin123")
        
        admin_exists = Account.query.filter_by(email=admin_email).first()
        
        if not admin_exists:
           
            hashed_password = bcrypt.generate_password_hash(admin_pass).decode('utf-8')

            new_admin = Account(
                email=admin_email,
                password=hashed_password, 
                role='Admin',
                is_temp_password=False,
                is_verified=True
            )
            db.session.add(new_admin)
            try:
                db.session.commit()
                print(f"Admin initialized with hashed password: {admin_email}")
            except Exception as e:
                db.session.rollback()
                print(f"Failed to initialize admin: {e}")
        else:
            print("Admin account already present.")

initialize_system()

if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=5000)