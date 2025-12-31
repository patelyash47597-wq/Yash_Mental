import React from "react";

export default function ModerateServices() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-4xl w-full animate-fadeIn text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-700 mb-6">
          🟡 Moderate Support Resources
        </h1>
        <p className="text-gray-700 mb-8">
          Based on your self-assessment, these features are designed to help you manage your mental well-being.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Peer-to-Peer Support */}
          <a
            href="/peer-support"
            className="bg-yellow-100 hover:bg-yellow-200 rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-300 shadow-md"
          >
            <span className="text-4xl mb-4">🤝</span>
            <h2 className="text-xl font-semibold text-gray-800">
              Peer-to-Peer Support
            </h2>
            <p className="text-gray-600 mt-2 text-sm">
              Connect with trained students or peers with similar experiences.
            </p>
          </a>

          {/* Multilingual Diary */}
          <a
            href="/diary"
            className="bg-yellow-100 hover:bg-yellow-200 rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-300 shadow-md"
          >
            <span className="text-4xl mb-4">📓</span>
            <h2 className="text-xl font-semibold text-gray-800">
              Multilingual Diary
            </h2>
            <p className="text-gray-600 mt-2 text-sm">
              Write your thoughts safely in multiple languages.
            </p>
          </a>

          {/* AI Thought Detox */}
          <a
            href="/Detox"
            className="bg-yellow-100 hover:bg-yellow-200 rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-300 shadow-md"
          >
            <span className="text-4xl mb-4">🗑️</span>
            <h2 className="text-xl font-semibold text-gray-800">
              AI “Thought Detox” Bin
            </h2>
            <p className="text-gray-600 mt-2 text-sm">
              Safely process and organize your thoughts using AI guidance.
            </p>
          </a>

          {/* Image Therapy */}
          <a
            href="/IB"
            className="bg-yellow-100 hover:bg-yellow-200 rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-300 shadow-md"
          >
            <span className="text-4xl mb-4">🖼️</span>
            <h2 className="text-xl font-semibold text-gray-800">
              Image Therapy
            </h2>
            <p className="text-gray-600 mt-2 text-sm">
              Visual exercises to relax and stimulate positive emotions.
            </p>
          </a>
        </div>
   <div className="flex flex-row gap-4 justify-center">
        <button
          onClick={() => (window.location.href = "/mild")}
          className="mt-10 bg-yellow-600 text-white px-8 py-3 rounded-xl hover:bg-yellow-700 transition-all duration-300 shadow-lg font-semibold"
        >
          🌿 Explore Mild Features
        </button>
                <button
          onClick={() => (window.location.href = "/")}
          className="mt-10 bg-yellow-600 text-white px-8 py-3 rounded-xl hover:bg-yellow-700 transition-all duration-300 shadow-lg font-semibold"
        >
          🌿 Home
        </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      ` }} />
    </div>
  );
}
