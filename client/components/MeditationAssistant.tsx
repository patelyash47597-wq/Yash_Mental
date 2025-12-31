import React, { useEffect } from "react";
import Typed from "typed.js";
import Header from "./Header";

const MeditationAssistant: React.FC = () => {
  useEffect(() => {
    const typed = new Typed(".typing", {
      strings: [
        "Feeling stressed?",
        "Mind feels heavy?",
        "Need peace?",
        "Let's meditate 🧘‍♀️"
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

    if (!text) return alert("Describe your mood first!");

    const res = await fetch("http://localhost:5002/detect_mood", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await res.json();

    document.getElementById("result")!.innerHTML =
      `🧠 Mood detected: <b>${data.mood.toUpperCase()}</b>`;

    document.getElementById("meditationPlayer")!.innerHTML = `
      <iframe 
        src="${data.video}"
        class="w-full h-[260px] rounded-xl mt-5"
        allowfullscreen
      ></iframe>

      <iframe 
        src="${data.audio}"
        class="w-full h-[120px] rounded-xl mt-4"
        allowfullscreen
      ></iframe>
    `;
  };

  return (
    <div className="min-h-screen bg-beacon-beige flex justify-center items-center relative pt-20">

      <div className="absolute top-0 left-0 w-full">
        <Header />
      </div>

      <div className="
        w-[90%] max-w-[720px] p-10 rounded-[25px] bg-white text-center 
        shadow-[0_0_25px_rgba(0,0,0,0.15)]
      ">
        <h2 className="text-[26px] font-semibold text-gray-800">
          🧘 AI Meditation Assistant
        </h2>

        <div className="typing text-[#4caf50] h-[25px] mt-2"></div>

        <input
          id="moodText"
          type="text"
          placeholder="Type how you feel..."
          className="
            mt-5 w-[85%] p-3 rounded-xl border
            focus:outline-none focus:ring-2 focus:ring-green-400
          "
        />

        <button
          onClick={detectMood}
          className="
            mt-6 px-6 py-3 rounded-xl
            bg-green-500 text-white font-medium
            hover:scale-105 transition
          "
        >
          Start Meditation 🌿
        </button>

        <div id="result" className="mt-6 text-lg"></div>
        <div id="meditationPlayer" className="mt-4"></div>
      </div>
    </div>
  );
};

export default MeditationAssistant;
