from flask import Flask
from auth import auth_app
from bmi import bmi_app
from caloric_needs import caloric_needs_app
from user_data import user_data_app
from openai_response import openai_app
from db import configure_db
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = "secret"

# blueprints

app.register_blueprint(auth_app)
app.register_blueprint(bmi_app)
app.register_blueprint(caloric_needs_app)
app.register_blueprint(user_data_app)
app.register_blueprint(openai_app)

configure_db(app)  # Initialize database
if __name__ == '__main__':
    app.run(debug=True)
