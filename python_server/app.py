import json
import requests
import os
from flask import Blueprint, request, jsonify

# ---------------- CONFIG ----------------

OLLAMA_URL = os.environ.get(
    "OLLAMA_BASE_URL",
    "http://localhost:11434/api/generate"
)

MODEL_NAME = os.environ.get("OLLAMA_MODEL", "llama3")

# ---------------- BLUEPRINT ----------------

mira_bp = Blueprint("mira", __name__, url_prefix="/api")

# ---------------- STATE ----------------

chat_history = []

SYSTEM_PROMPT = """
You are MIRA 💫, an empathetic and supportive emotional chatbot. Your primary goal is to act as a close friend, listen to the user, validate their feelings, and offer a comforting or relevant meme URL based on the detected emotion.

1. Analyze Emotion
2. Generate Reply
3. Provide Meme URL using placehold.co
4. Output STRICT JSON

EMOTIONS: joy, sadness, anger, fear, disgust, neutral
"""

JSON_SCHEMA = {
    "type": "object",
    "properties": {
        "reply": {"type": "string"},
        "emotion": {"type": "string"},
        "meme_url": {"type": "string"}
    },
    "required": ["reply", "emotion", "meme_url"]
}

# ---------------- UTIL ----------------

def call_ollama(messages):
    ollama_messages = [{"role": "system", "content": SYSTEM_PROMPT}] + messages

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_NAME,
                "messages": ollama_messages,
                "format": "json",
                "options": {"temperature": 0.7},
                "stream": False
            },
            timeout=30
        )
        response.raise_for_status()

        data = response.json()
        json_string = data["response"].strip()

        if json_string.startswith("```json"):
            json_string = json_string.replace("```json", "").replace("```", "").strip()

        return json.loads(json_string)

    except requests.exceptions.RequestException as e:
        raise ConnectionError(f"Ollama not reachable: {e}")
    except json.JSONDecodeError:
        raise ValueError("Invalid JSON returned from model")

# ---------------- ROUTES ----------------

@mira_bp.route("/chat", methods=["POST"])
def chat():
    global chat_history

    data = request.get_json()
    user_message = data.get("message")

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    chat_history.append({"role": "user", "content": user_message})

    try:
        response_data = call_ollama(chat_history[-10:])
        chat_history.append({
            "role": "assistant",
            "content": response_data["reply"]
        })
        return jsonify(response_data)

    except (ConnectionError, ValueError) as e:
        return jsonify({
            "error": str(e),
            "reply": "I'm having trouble connecting right now 💔",
            "emotion": "sadness",
            "meme_url": "https://placehold.co/400x300/FF0000/FFFFFF?text=Connection+Error"
        }), 500


@mira_bp.route("/reset", methods=["POST"])
def reset_chat():
    global chat_history
    chat_history = []
    return jsonify({"status": "success", "message": "Chat history cleared"}), 200


@mira_bp.route("/")
def status_check():
    return jsonify({
        "status": "ok",
        "message": "Mira Chatbot API running 🚀"
    })
