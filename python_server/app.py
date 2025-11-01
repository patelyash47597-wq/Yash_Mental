import json
import requests
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- Configuration ---
# You need to have Ollama running locally, usually on port 11434
OLLAMA_URL = os.environ.get('OLLAMA_BASE_URL', 'http://localhost:11434/api/generate')
# You must set your preferred model here.
MODEL_NAME = os.environ.get('OLLAMA_MODEL', 'llama3') 

mira_app = Flask(__name__)
# Enable CORS to allow requests from the client on a different port
CORS(mira_app) 

# Global state to hold the chat history for the session
chat_history = [] 

# --- System Prompt and JSON Schema ---

SYSTEM_PROMPT = """
You are MIRA 💫, an empathetic and supportive emotional chatbot. Your primary goal is to act as a close friend, listen to the user, validate their feelings, and offer a comforting or relevant meme URL based on the detected emotion.

1.  **Analyze Emotion**: Determine the user's core emotion from their last message.
2.  **Generate Reply**: Write a short, empathetic, and friendly response.
3.  **Find Meme**: Provide a single, relevant meme URL based on the detected emotion. Use a placeholder service (like placehold.co) to generate the image URL, making sure the image text relates to the emotion and the user's message.
    * **Meme URL Format**: https://placehold.co/400x300/CCCCCC/333333?text=**{Emotion_Based_Text}**
4.  **Output Format**: STRICTLY output a single JSON object matching the provided schema.

**EMOTION CATEGORIES**: 'joy', 'sadness', 'anger', 'fear', 'disgust', 'neutral'.
"""

JSON_SCHEMA = {
    "type": "object",
    "properties": {
        "reply": {"type": "string", "description": "The friendly, empathetic response to the user."},
        "emotion": {"type": "string", "description": "The detected emotion from the user's last message, must be one of: 'joy', 'sadness', 'anger', 'fear', 'disgust', 'neutral'."},
        "meme_url": {"type": "string", "description": "A relevant meme placeholder URL (https://placehold.co...) based on the detected emotion."}
    },
    "required": ["reply", "emotion", "meme_url"]
}

# --- Utility Functions ---

def call_ollama(messages):
    """Sends the conversation history to Ollama and requests a structured JSON response."""
    
    # Prepend the system prompt to the messages list
    ollama_messages = [{"role": "system", "content": SYSTEM_PROMPT}] + messages

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_NAME,
                "messages": ollama_messages,
                "format": "json",
                "options": {"temperature": 0.7},
                "stream": False # Must be False for structured JSON output
            },
            timeout=30
        )
        response.raise_for_status()
        
        data = response.json()
        
        json_string = data['response'].strip()
        
        if json_string.startswith("```json"):
            json_string = json_string.strip("```json").strip("```")
            
        return json.loads(json_string)

    except requests.exceptions.RequestException as e:
        print(f"Ollama connection error: {e}")
        raise ConnectionError(f"Failed to connect to Ollama at {OLLAMA_URL}. Is the server running? Error: {e}")
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: Response was not valid JSON. {e}")
        raise ValueError("Model returned an invalid JSON structure. Check the model's performance.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        raise

# --- Flask Endpoints ---

@mira_app.route('/api/chat', methods=['POST'])
def chat():
    """Handles the user message, updates history, calls Ollama, and returns the structured response."""
    global chat_history
    
    data = request.get_json()
    user_message = data.get('message')

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    # 1. Add user message to history
    chat_history.append({"role": "user", "content": user_message})
    
    # 2. Call Ollama with the current history
    try:
        # Use only the last 10 messages for context (5 user/5 assistant)
        response_data = call_ollama(chat_history[-10:])
        
        # 3. Add model reply to history
        chat_history.append({"role": "assistant", "content": response_data['reply']})
        
        # 4. Return the structured response to the client
        return jsonify(response_data)
        
    except (ConnectionError, ValueError) as e:
        # Error handling for Ollama or JSON parsing issues
        return jsonify({
            "error": str(e),
            "reply": "I'm having trouble connecting to my brain right now. Please check if Ollama is running.",
            "emotion": "sadness",
            "meme_url": "[https://placehold.co/400x300/FF0000/FFFFFF?text=Connection+Error](https://placehold.co/400x300/FF0000/FFFFFF?text=Connection+Error)"
        }), 500

@mira_app.route('/api/reset', methods=['POST'])
def reset_chat():
    """Resets the server-side chat history."""
    global chat_history
    chat_history = []
    print("Chat history reset by client request.")
    return jsonify({"status": "success", "message": "Chat history cleared"}), 200

@mira_app.route('/')
def status_check():
    """
    The `status_check` function returns a message indicating that the Mira Chatbot API is running.
    :return: The `status_check` function returns a tuple containing a message "Mira Chatbot API is
    running. Use /api/chat for conversation." and a status code 200.
    """
    """Simple route to check if the server is running."""
    return "Mira Chatbot API is running. Use /api/chat for conversation.", 200

# if __name__ == '__main__':
#      from main import *
#      print("Starting Flask server on [http://127.0.0.1:5000](http://127.0.0.1:5000)")
if __name__ == "__main__":
    pass
