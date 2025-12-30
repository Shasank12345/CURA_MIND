from extension import db
from datetime import datetime

class Account(db.Model):
    __tablename__ = 'accounts'
   
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(15), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    doctor_profile = db.relationship('Doctor', backref='account', cascade="all, delete-orphan", uselist=False)
    user_profile = db.relationship('User', backref='account', cascade="all, delete-orphan", uselist=False)
    
    is_temp_password = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)

class User(db.Model):
    __tablename__ = 'user_profiles'
    id = db.Column(db.Integer, primary_key=True)
    acc_id = db.Column(db.Integer, db.ForeignKey('accounts.id', ondelete='CASCADE'), unique=True, nullable=False)
    
    full_name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False, unique=True)
    address = db.Column(db.String(255), nullable=False)
    dob = db.Column(db.Date, nullable=False)

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


class Otp(db.Model):
    __tablename__ = 'otps'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    otp = db.Column(db.String(6), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)
    used = db.Column(db.Boolean, default=False)