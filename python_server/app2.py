from flask import Flask, request, jsonify
from textblob import TextBlob
from flask_cors import CORS

mood_app = Flask(__name__)
CORS(mood_app)

PLAYLISTS = {
    "happy": "https://open.spotify.com/embed/playlist/37i9dQZF1DXdPec7aLTmlC",
    "sad": "https://open.spotify.com/embed/playlist/37i9dQZF1DX7qK8ma5wgG1",
    "angry": "https://open.spotify.com/embed/playlist/37i9dQZF1DWYxwmBaMqxsl",
    "anxious": "https://open.spotify.com/embed/playlist/37i9dQZF1DWXe9gFZP0gtP",
    "neutral": "https://open.spotify.com/embed/playlist/37i9dQZF1DX3rxVfibe1L0"
}

@mood_app.route('/')
def home():
    return jsonify({"message": "Mood API running ✅"})

@mood_app.route('/detect_mood', methods=['POST'])
def detect_mood():
    data = request.get_json()
    text = data.get("text", "")

    blob = TextBlob(text)
    sentiment = blob.sentiment.polarity

    if sentiment > 0.2:
        mood = "happy"
    elif sentiment < -0.2:
        if "angry" in text or "mad" in text:
            mood = "angry"
        elif "anxious" in text or "nervous" in text:
            mood = "anxious"
        else:
            mood = "sad"
    else:
        mood = "neutral"

    return jsonify({"mood": mood, "playlist": PLAYLISTS[mood]})

if __name__ == "__main__":
    pass
