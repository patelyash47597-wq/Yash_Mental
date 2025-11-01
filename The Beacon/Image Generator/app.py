# from flask import Flask, render_template, request, jsonify, session
# from transformers import pipeline
# import requests
# import random
# import subprocess
# import json
# from huggingface_hub import InferenceClient

# app = Flask(__name__)
# app.secret_key = "your_secret_key"

# # Emotion detection model
# emotion_model = pipeline(
#     "text-classification",
#     model="j-hartmann/emotion-english-distilroberta-base",
#     return_all_scores=False
# )

# # Meme subreddits by emotion
# MEME_SUBREDDITS = {
#     "joy": ["wholesomememes", "MadeMeSmile"],
#     "sadness": ["wholesomememes", "me_irl", "GetMotivated"],
#     "anger": ["memes", "funny"],
#     "fear": ["AdviceAnimals", "wholesomememes"],
#     "disgust": ["memes", "dankmemes"],
#     "neutral": ["wholesomememes", "funny"]
# }

# def generate_llm_reply(history):
#     """
#     Uses a locally running LLM via Ollama to generate response.
#     """
#     conversation = "\n".join([f"{m['role'].capitalize()}: {m['content']}" for m in history])
#     prompt = f"""
# You are MIRA 💫, an empathetic and emotionally intelligent friend who comforts people warmly.
# You use natural, conversational language (like texting a close friend).
# Respond briefly but meaningfully.

# {conversation}
# Mira:
#     """

#     try:
#         result = subprocess.run(
#             ["ollama", "run", "llama3", prompt],
#             capture_output=True, text=True, timeout=60
#         )
#         return result.stdout.strip()
#     except Exception as e:
#         print("LLM Error:", e)
#         return "Aww, I’m here for you no matter what ❤️"


# @app.route("/")
# def home():
#     session["history"] = [
#         {"role": "system", "content": "You are MIRA 💫, an empathetic emotional chatbot and close friend."}
#     ]
#     return render_template("chatbot.html")


# @app.route("/chat", methods=["POST"])
# def chat():
#     user_message = request.json.get("message", "")

#     # Step 1: Emotion detection
#     emotion_result = emotion_model(user_message)[0]
#     emotion = emotion_result["label"].lower()

#     # Step 2: Meme generation (always based on emotion)
#     meme_url = None
#     subreddit = random.choice(MEME_SUBREDDITS.get(emotion, MEME_SUBREDDITS["neutral"]))
#     try:
#         meme_response = requests.get(f"https://meme-api.com/gimme/{subreddit}", timeout=10).json()
#         meme_url = meme_response.get("url")
#     except Exception as e:
#         print("Meme API error:", e)
#         meme_url = None

#     # Step 3: Chat history
#     history = session.get("history", [])
#     history.append({"role": "user", "content": f"[Emotion detected: {emotion}] {user_message}"})

#     # Step 4: Get LLM reply
#     bot_reply = generate_llm_reply(history)

#     # Step 5: Save and return
#     history.append({"role": "assistant", "content": bot_reply})
#     session["history"] = history

#     return jsonify({
#         "emotion": emotion,
#         "reply": bot_reply,
#         "meme_url": meme_url
#     })




# if __name__ == "__main__":
#     app.run(debug=True)
