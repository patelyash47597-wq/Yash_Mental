from flask import Flask, request, jsonify
from textblob import TextBlob
from flask_cors import CORS

meditation_app = Flask(__name__)
CORS(meditation_app)

MEDITATIONS = {
    "happy": {
        "video": "https://www.youtube.com/embed/1ZYbU82GVz4",
        "audio": "https://www.youtube.com/embed/cEqZthCaMpo"
    },
    "sad": {
        "video": "https://www.youtube.com/embed/inpok4MKVLM",
        "audio": "https://www.youtube.com/embed/z6X5oEIg6Ak"
    },
    "angry": {
        "video": "https://www.youtube.com/embed/MIr3RsUWrdo",
        "audio": "https://www.youtube.com/embed/qQyQj2Fgi_k"
    },
    "anxious": {
        "video": "https://www.youtube.com/embed/sTANio_2E0Q",
        "audio": "https://www.youtube.com/embed/GgP75HAvrlY"
    },
    "neutral": {
        "video": "https://www.youtube.com/embed/ZToicYcHIOU",
        "audio": "https://www.youtube.com/embed/o-6f5wQXSu8"
    }
}

@meditation_app.route("/")
def home():
    return jsonify({"message": "Meditation API running 🧘‍♂️"})

@meditation_app.route("/detect_mood", methods=["POST"])
def detect_mood():
    data = request.get_json()
    text = data.get("text", "")

    blob = TextBlob(text)
    sentiment = blob.sentiment.polarity
    text_lower = text.lower()

    if sentiment > 0.2:
        mood = "happy"
    elif sentiment < -0.2:
        if "angry" in text_lower or "mad" in text_lower:
            mood = "angry"
        elif "anxious" in text_lower or "stress" in text_lower:
            mood = "anxious"
        else:
            mood = "sad"
    else:
        mood = "neutral"

    return jsonify({
        "mood": mood,
        "video": MEDITATIONS[mood]["video"],
        "audio": MEDITATIONS[mood]["audio"]
    })

if __name__ == "__main__":
    pass
