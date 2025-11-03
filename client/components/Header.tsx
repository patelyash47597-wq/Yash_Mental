"use client";
import { useEffect, useState } from "react";
import { MessageSquare, Menu } from "lucide-react";
import { auth, db } from "@/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

declare global {
  interface Window {
    botpress: any;
    botpressWebChat: any;
  }
}

export default function Header() {
  const [isBot, setIsBot] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [botInitialized, setBotInitialized] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [anonName, setAnonName] = useState<string>("");
  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // fallback avatar

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 80;
      setIsBot(scrolled);
      setCompact(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setAnonName(data.anonymousUsername || "User");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const botImage =
    "https://th.bing.com/th/id/OIP.4FuBjYmRvtEXBS-bHi63RQAAAA?w=204&h=186&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3";
  const meImage =
    "https://static.vecteezy.com/system/resources/previews/019/858/376/non_2x/chat-flat-color-outline-icon-free-png.png";

  // Initialize Botpress
  const openChat = () => {
    setChatOpen(true);

    if (!botInitialized && window.botpress && window.botpress.init) {
      setBotInitialized(true);

      let userInteracted = false;
      const unlockAudio = () => {
        if (!userInteracted) {
          userInteracted = true;
          const utterance = new SpeechSynthesisUtterance("");
          speechSynthesis.speak(utterance);
        }
      };

      window.addEventListener("click", unlockAudio);
      window.addEventListener("keydown", unlockAudio);

      window.botpress.init({
        botId: "b7a022e3-94f6-4317-b840-cb0ccea6fe66",
        clientId: "0bc71b51-1a41-4fa1-a147-4339105f567a",
        selector: "#bp-embedded-webchat",
        configuration: {
          version: "v2",
          embedded: true,
          hideWidget: true,
          themeMode: "light",
          botName: "Your Brand Assistant",
          color: "#3276EA",
          variant: "solid",
          headerVariant: "glass",
          radius: 3,
          fontFamily: "Abhaya Libre",
          feedbackEnabled: false,
          soundEnabled: false,
        },
      });

      window.botpress.on("webchat:ready", () => {
        setTimeout(() => window.botpress.open(), 500);

        window.botpress.on("incoming_message", (event: any) => {
          const text =
            event.payload?.text || event.payload?.title || event.preview;
          if (userInteracted && (window as any).responsiveVoice && text) {
            (window as any).responsiveVoice.cancel();
            (window as any).responsiveVoice.speak(text, "UK English Male");
          }
        });
      });
    } else if (botInitialized) {
      window.botpress.open();
    }
  };

  return (
    <>
      {/* HEADER */}
      <header
        className={`fixed w-full top-0 z-30 transition-all duration-300 border-b ${
          compact ? "bg-white/90 shadow-sm py-4" : "bg-white/90 py-6"
        }`}
      >
        <nav className="container mx-auto px-4 flex items-center justify-between transition-all duration-300">
          {/* LOGO */}
          <h1
            className={`font-bowlby font-bold transition-all duration-300 ${
              compact ? "text-3xl" : "text-4xl"
            }`}
          >
            <span className="text-beacon-blue">The</span>
            <span className="text-beacon-blue"> Beacon</span>
          </h1>

          {/* NAV LINKS */}
          {!compact && (
            <div className="hidden sm:flex flex-row font-lato gap-6">
              <a
                className="text-4xl font-semibold hover:text-beacon-yellow"
                href="#"
              >
                Check It
              </a>
              <a
                className="text-4xl font-semibold hover:text-beacon-yellow"
                href="#"
              >
                About Us
              </a>
              <a
                className="text-4xl font-semibold hover:text-beacon-yellow"
                href="#"
              >
                Article
              </a>
              <a
                className="text-4xl font-semibold hover:text-beacon-yellow"
                href="#"
              >
                Help
              </a>
            </div>
          )}

          <div className="flex items-center gap-4">
            {/* ✅ Show Profile If Logged In */}
            {user && (
              <div className="flex items-center gap-2 mr-2">
                <img
                  src={user.photoURL || defaultAvatar}
                  className="w-10 h-10 rounded-full border"
                  alt="User Avatar"
                />

                <span className="font-semibold text-lg text-gray-800">
                  {anonName}
                </span>
              </div>
            )}

            {/* ✅ Sign Up only if NOT logged in */}
            {!compact && !user && (
              <button className="bg-red-600 text-xl text-white px-6 py-3 rounded-lg font-lato hover:bg-red-700 transition">
                <a href="/signup">Sign Up</a>
              </button>
            )}

            {/* Bot Icon */}
            <img
              src={botImage}
              onClick={openChat}
              className={`w-[70px] h-[70px] rounded-2xl cursor-pointer ${
                compact ? "scale-90" : "scale-100"
              } transition-transform duration-300`}
            />

            {/* Mobile Menu */}
            {compact && (
              <button
                onClick={() => setMenuOpen(true)}
                className="p-2 hover:opacity-70 transition"
              >
                <Menu size={34} />
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* MENU PANEL */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex">
          <div className="w-72 bg-white h-full shadow-xl p-6 animate-slideIn flex flex-col gap-6">
            {/* ✅ Show username in menu too */}
            {user && (
              <div className="flex items-center gap-2 mb-4">
                <img
                  src={user.photoURL || defaultAvatar}
                  className="w-10 h-10 rounded-full border"
                  alt=""
                />
                <span className="font-bold text-lg text-gray-700">
                  {anonName}
                </span>
              </div>
            )}

            <h2 className="text-2xl font-bold text-beacon-blue">Menu</h2>
            <a
              className="text-xl font-semibold hover:text-beacon-yellow"
              href="#"
            >
              Check It
            </a>
            <a
              className="text-xl font-semibold hover:text-beacon-yellow"
              href="#"
            >
              About Us
            </a>
            <a
              className="text-xl font-semibold hover:text-beacon-yellow"
              href="#"
            >
              Article
            </a>
            <a
              className="text-xl font-semibold hover:text-beacon-yellow"
              href="#"
            >
              Help
            </a>

            {/* Sign Up in menu only if NOT logged in */}
            {!user && (
              <button className="mt-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
                <a href="/signup">Sign Up</a>
              </button>
            )}
          </div>
          <div className="flex-1" onClick={() => setMenuOpen(false)}></div>
        </div>
      )}

      {/* CHAT WINDOW */}
      {chatOpen && (
        <div
          id="bp-embedded-webchat"
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "350px",
            height: "500px",
            zIndex: 1000,
          }}
        />
      )}

      {/* Tailwind Animation */}
      <style jsx>{`
        .animate-slideIn {
          animation: slideIn 0.25s ease-out;
        }
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
