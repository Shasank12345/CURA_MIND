from .auth import auth 
from .admin import admin 

def register_routes(app):
    app.register_blueprint(auth, url_prefix="/auth")
    app.register_blueprint(admin, url_prefix="/admin")