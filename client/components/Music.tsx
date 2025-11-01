import React, { useEffect } from "react";
import Typed from "typed.js";
import "./MusicAssistant.css";

const MusicAssistant: React.FC = () => {
  useEffect(() => {
    const typed = new Typed(".typing", {
      strings: [
        "Feeling anxious?",
        "Need focus?",
        "Stressed out?",
        "Let's find your perfect music 🎵"
      ],
      typeSpeed: 50,
      backSpeed: 25,
      loop: true
    });

    return () => typed.destroy();
  }, []);

  const detectMood = async () => {
    const input = document.getElementById("moodText") as HTMLInputElement;
    const text = input.value.trim();

    if (!text) return alert("Please describe how you're feeling!");

    const res = await fetch("http://localhost:5001/detect_mood", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    document.getElementById("result")!.innerHTML =
      `🌈 Your mood: <b>${data.mood.toUpperCase()}</b>`;

    document.getElementById("musicPlayer")!.innerHTML = `
      <iframe src="${data.playlist}" allow="autoplay; clipboard-write; encrypted-media; fullscreen"></iframe>
    `;
  };

  return (
    <div className="music-page">
      <div className="container-music">
        <h2>🎧 AI Music Assistant</h2>
        <div className="typing"></div>

        <input id="moodText" type="text" placeholder="Type how you feel... 🧠💬" />
        <button onClick={detectMood}>Find My Music 🎶</button>

        <div id="result"></div>
        <div id="musicPlayer"></div>
      </div>
    </div>
  );
};

export default MusicAssistant;
