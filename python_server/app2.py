from flask import Blueprint, request, jsonify
from textblob import TextBlob

mood_bp = Blueprint("mood", __name__)

PLAYLISTS = {
    "happy": "https://open.spotify.com/embed/playlist/37i9dQZF1DXdPec7aLTmlC",
    "sad": "https://open.spotify.com/embed/playlist/37i9dQZF1DX7qK8ma5wgG1",
    "angry": "https://open.spotify.com/embed/playlist/37i9dQZF1DWYxwmBaMqxsl",
    "anxious": "https://open.spotify.com/embed/playlist/37i9dQZF1DWXe9gFZP0gtP",
    "neutral": "https://open.spotify.com/embed/playlist/37i9dQZF1DX3rxVfibe1L0"
}

@mood_bp.route("/")
def home():
    return jsonify({"message": "Mood API running ✅"})

@mood_bp.route("/detect_mood", methods=["POST"])
def detect_mood():
    data = request.get_json()
    text = data.get("text", "")

    blob = TextBlob(text)
    sentiment = blob.sentiment.polarity

    if sentiment > 0.2:
        mood = "happy"
    elif sentiment < -0.2:
        if "angry" in text.lower() or "mad" in text.lower():
            mood = "angry"
        elif "anxious" in text.lower() or "nervous" in text.lower():
            mood = "anxious"
        else:
            mood = "sad"
    else:
        mood = "neutral"

    return jsonify({
        "mood": mood,
        "playlist": PLAYLISTS[mood]
    })
