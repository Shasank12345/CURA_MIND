from .auth import auth 
from .admin import admin 
from .triage import triage
from .chat import chat
from .user import user
from .doctor import doctor
from .otochat import otochat
def register_routes(app):
    app.register_blueprint(auth, url_prefix="/auth")
    app.register_blueprint(admin, url_prefix="/admin")
    app.register_blueprint(triage,url_prefix="/triage")
    app.register_blueprint(chat,url_prefix='/chat')
    app.register_blueprint(user,url_prefix='/user')
    app.register_blueprint(doctor,url_prefix='/doctor')
    app.register_blueprint(otochat,url_prefix='/otochat')