from extension import db
from datetime import datetime

class Account(db.Model):
    __tablename__ = 'accounts'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(15), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_temp_password = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)

    doctor_profile = db.relationship('Doctor', backref='account', cascade="all, delete-orphan", uselist=False)
    user_profile = db.relationship('User', backref='account', cascade="all, delete-orphan", uselist=False)

class User(db.Model):
    __tablename__ = 'user_profiles'
    id = db.Column(db.Integer, primary_key=True)
    acc_id = db.Column(db.Integer, db.ForeignKey('accounts.id', ondelete='CASCADE'), unique=True, nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False, unique=True)
    address = db.Column(db.String(255), nullable=False)
    dob = db.Column(db.Date, nullable=False)
    triage_sessions = db.relationship('TriageSession', backref='patient', lazy=True)

class Doctor(db.Model):
    __tablename__ = 'doctor_profiles'
    id = db.Column(db.Integer, primary_key=True)
    acc_id = db.Column(db.Integer, db.ForeignKey('accounts.id', ondelete='CASCADE'), unique=True, nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False, unique=True)
    area_of_specialization = db.Column(db.String(100), nullable=False)
    license_no = db.Column(db.String(100), nullable=False, unique=True)
    dob = db.Column(db.Date, nullable=False)
    license_img = db.Column(db.String(255))
    bio_summary = db.Column(db.Text, nullable=True) 
    is_available_online = db.Column(db.Boolean, default=False)
    hospital_name = db.Column(db.String(150), nullable=True)
    triage_sessions=db.relationship('TriageSession',backref='doctor',lazy=True)

class TriageSession(db.Model):
    __tablename__ = 'triage_sessions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_profiles.id', ondelete='CASCADE'), nullable=False)
    doctor_id=db.Column(db.Integer,db.ForeignKey('doctor_profiles.id',ondelete='CASCADE'),nullable=True)

    v0_age = db.Column(db.Float, nullable=True) 
    v1_accident = db.Column(db.Integer, nullable=True) 
    v2_walking = db.Column(db.Integer, nullable=True)
    v3_lateral = db.Column(db.Integer, nullable=True)
    v3_medial = db.Column(db.Integer, nullable=True)   
    v4_midfoot = db.Column(db.Integer, nullable=True)
    v4_navicular = db.Column(db.Integer, nullable=True) 
    v5_swelling = db.Column(db.Integer, nullable=True)  
    v6_stability = db.Column(db.Integer, nullable=True) 
    final_flag = db.Column(db.String(10), nullable=True) 
    soap_s = db.Column(db.Text, nullable=True)
    soap_o = db.Column(db.Text, nullable=True)
    soap_a = db.Column(db.Text, nullable=True)
    soap_p = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Otp(db.Model):
    __tablename__ = 'otps'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    otp = db.Column(db.String(6), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)
    used = db.Column(db.Boolean, default=False)



class Consultation(db.Model):
    __tablename__ = 'consultations'
    id = db.Column(db.Integer, primary_key=True)
    
    patient_id = db.Column(db.Integer, db.ForeignKey('user_profiles.id', ondelete='CASCADE'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor_profiles.id', ondelete='CASCADE'), nullable=False)
    triage_id = db.Column(db.Integer, db.ForeignKey('triage_sessions.id', ondelete='CASCADE'), nullable=False)
    
    status = db.Column(db.String(20), default='pending', nullable=False) # pending, accepted, rejected, completed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # NEW: Clinical documentation fields
    clinical_summary = db.Column(db.Text, nullable=True) 
    ended_at = db.Column(db.DateTime, nullable=True)

    # Relationships
    patient = db.relationship('User', backref='consultations')
    doctor = db.relationship('Doctor', backref='consultations_as_doctor')
    triage_session = db.relationship('TriageSession', backref='consultation_ref')

class Message(db.Model):
    __tablename__ = 'messages' # Always define this explicitly
    id = db.Column(db.Integer, primary_key=True)
    
    # Fix: consultation_id must point to 'consultations.id', NOT 'consultation.id'
    consultation_id = db.Column(db.Integer, db.ForeignKey('consultations.id', ondelete='CASCADE'), nullable=False)
    
    # Fix: sender_id must point to 'accounts.id', NOT 'account.id'
    sender_id = db.Column(db.Integer, db.ForeignKey('accounts.id', ondelete='CASCADE'), nullable=False)
    
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    sender = db.relationship('Account', backref='messages')