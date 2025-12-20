from flask import Flask
from flask_cors import CORS
from config import Config
from extension import db, mail
from routes import register_routes

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, supports_credentials=True)

db.init_app(app)
mail.init_app(app)
app.secret_key=app.config['SECRET_KEY']
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] = False  
register_routes(app)

with app.app_context():
    db.create_all()
    print("Tables created successfully!")

if __name__ == "__main__":
    app.run(debug=True)
