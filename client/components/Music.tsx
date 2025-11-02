import React, { useEffect } from "react";
import Typed from "typed.js";

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
      <iframe 
        src="${data.playlist}" 
        allow="autoplay; clipboard-write; encrypted-media; fullscreen"
        class="w-[calc(100%+80px)] h-[400px] border-none rounded-b-[25px] shadow-[0_0_15px_rgba(0,0,0,0.2)] mt-5 ml-[-40px] mr-[-40px]"
      ></iframe>
    `;
  };

  return (
    <div className="h-screen bg-[linear-gradient(135deg,#a8edea,#fed6e3)] flex justify-center items-center">
      <div className="w-[420px] p-10 rounded-[25px] bg-white/20 backdrop-blur-[15px] 
                      shadow-[0_0_40px_rgba(0,0,0,0.1)] text-center transition-all 
                      hover:-translate-y-1 hover:shadow-[0_0_45px_rgba(0,0,0,0.15)]">

        <h2 className="font-semibold text-gray-800 text-[26px] mb-1">🎧 AI Music Assistant</h2>

        <div className="typing text-[#ff4081] font-medium h-[25px] mt-1"></div>

        <input
          id="moodText"
          type="text"
          placeholder="Type how you feel... 🧠💬"
          className="mt-5 w-[85%] p-3 rounded-[12px] bg-white/90 text-[15px]
                     shadow-inner border-none outline-none transition 
                     focus:scale-[1.03] focus:shadow-[0_0_8px_#ff80ab]"
        />

        <button
          onClick={detectMood}
          className="mt-5 px-5 py-3 rounded-[12px] 
                     bg-[linear-gradient(90deg,#ff80ab,#ff4081)] text-white font-medium 
                     transition hover:bg-[linear-gradient(90deg,#ff4081,#ff80ab)] 
                     hover:scale-[1.05]"
        >
          Find My Music 🎶
        </button>

        <div id="result" className="mt-6 text-[18px] font-medium text-[#444]"></div>

        <div id="musicPlayer"></div>
      </div>
    </div>
  );
};

export default MusicAssistant;
