import React from "react";
import Header from "@/components/Header";
export default function MildServices() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-blue-100 flex items-center justify-center p-4">
      <Header/>
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-4xl w-full animate-fadeIn text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 mb-8">
          🟢 Mild Support Resources
        </h1>
        <p className="text-gray-700 mb-8">
          Based on your self-assessment, here are some gentle activities to boost your well-being.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Meditation Video */}
          <a
            href="/meditation-video"
            className="bg-green-100 hover:bg-green-200 rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-300 shadow-md"
          >
            <span className="text-4xl mb-4">🧘‍♂️</span>
            <h2 className="text-xl font-semibold text-gray-800">Meditation Video</h2>
          </a>

          {/* Article */}
          <a
            href="/article"
            className="bg-green-100 hover:bg-green-200 rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-300 shadow-md"
          >
            <span className="text-4xl mb-4">📄</span>
            <h2 className="text-xl font-semibold text-gray-800">Article</h2>
          </a>
           <a
            href="/music"
            className="bg-green-100 hover:bg-green-200 rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-300 shadow-md"
          >
            <span className="text-4xl mb-4">🎶🎧</span>
            <h2 className="text-xl font-semibold text-gray-800">Music</h2>
          </a>


          {/* Diary */}
          <a
            href="/diary"
            className="bg-green-100 hover:bg-green-200 rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-300 shadow-md"
          >
            <span className="text-4xl mb-4">📓</span>
            <h2 className="text-xl font-semibold text-gray-800">Diary</h2>
          </a>
        </div>

        <button
          onClick={() => (window.location.href = "/")}
          className="mt-10 bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg font-semibold"
        >
          ← Back to Home
        </button>
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
