import React from "react";

export default function SevereServices() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-200 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-3xl w-full animate-fadeIn text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-red-700 mb-6">
          🔴 Severe Support Resources
        </h1>
        <p className="text-gray-700 mb-8">
          Based on your self-assessment, professional support is recommended. You can schedule a meeting with a counselor for guidance and assistance.
        </p>

        {/* Counsellor Support Card */}
        <div className="bg-red-100 hover:bg-red-200 rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-300 shadow-md mb-8">
          <span className="text-5xl mb-4">🧑‍⚕️</span>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Counsellor Support</h2>
          <p className="text-gray-600 mb-4 text-center">
            Schedule a meeting with a trained counselor for professional guidance.
          </p>
          <a
            href="/schedule-counsellor"
            className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all duration-300 shadow-md font-semibold"
          >
            Schedule Meeting
          </a>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <button
            onClick={() => (window.location.href = "/mild")}
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all duration-300 shadow-md font-semibold"
          >
            🌿 Go to Mild Features
          </button>

          <button
            onClick={() => (window.location.href = "/moderate")}
            className="bg-yellow-600 text-white px-6 py-3 rounded-xl hover:bg-yellow-700 transition-all duration-300 shadow-md font-semibold"
          >
            🌟 Go to Moderate Features
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-all duration-300 shadow-md font-semibold"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
