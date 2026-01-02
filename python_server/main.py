from flask import Flask
from flask_cors import CORS
import os

from app import mira_bp
from app2 import mood_bp
from app3 import meditation_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    # register all modules
    app.register_blueprint(mira_bp)
    app.register_blueprint(mood_bp)
    app.register_blueprint(meditation_bp)

    return app

if __name__ == "__main__":
    print("🚀 Starting Flask server...")

    app = create_app()
    port = int(os.environ.get("PORT", 5000))

    app.run(host="0.0.0.0", port=port)
