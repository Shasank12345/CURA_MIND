from extension import db
from datetime import datetime



class User(db.Model):
    id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    Full_Name = db.Column(db.String(100),nullable=False)
    Email = db.Column(db.String(100),nullable=False,unique=True)
    Password = db.Column(db.String(100),nullable=False,unique=False)
    Phone_Number=db.Column(db.String(10),nullable=False,unique=True)
    Address=db.Column(db.String(30),nullable=False)
    DOB = db.Column(db.Date,nullable=False)
    is_temp_password = db.Column(db.Boolean, default=True)


class Doctor(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    Full_Name = db.Column(db.String(100),nullable=False)
    Email = db.Column(db.String(100),nullable=False,unique=True)
    Password = db.Column(db.String(100),nullable=False,unique=False)
    Phone_Number=db.Column(db.String(10),nullable=False,unique=True)
    Area_of_Specialization=db.Column(db.String(100),nullable=False,unique=True)
    License_no=db.Column(db.String(100),nullable=False,unique=True)
    DOB = db.Column(db.Date,nullable=False)
    is_temp_password = db.Column(db.Boolean, default=True)


class Otp(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    otp = db.Column(db.String(6), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)
    used = db.Column(db.Boolean, default=False)


    





    

