import React, { useState, useEffect, useRef, useCallback } from 'react';
import Diary from './Diary';
import IB from './Image';

// --- SOUNDSCAPE OPTIONS ---
// UPDATED: Using more stable, directly playable MP3 links.
const SOUNDSCAPES = [
    { value: '', label: '-- Select --' },
    // Reliable Rain Sound
    { value: 'https://cdn.jsdelivr.net/gh/dev-x-files/public-assets@main/audio/rain-ambient.mp3', label: 'Rain' },
    // Reliable Ocean Waves Sound
    { value: 'https://cdn.jsdelivr.net/gh/dev-x-files/public-assets@main/audio/ocean-waves.mp3', label: 'Ocean Waves' },
    // Reliable Forest Sound
    { value: 'https://cdn.jsdelivr.net/gh/dev-x-files/public-assets@main/audio/forest-birds.mp3', label: 'Forest' },
];

// --- SESSION OPTIONS ---
const SESSION_DURATIONS = [
    { value: 0, label: '-- Select --' },
    { value: 30, label: '30 sec' },
    { value: 120, label: '2 min' },
    { value: 300, label: '5 min' },
];

// --- TIME FORMATTING ---
const formatTime = (seconds: number): string => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
};

// --- REACT COMPONENT ---

const SafeSpace: React.FC = () => {
    // State for overall application flow
    const [currentPage, setCurrentPage] = useState<'breathing' | 'journal' | 'chat'>(
        'breathing'
    );
    
    // --- STATE for Breathing/Audio ---
    const [selectedSoundscape, setSelectedSoundscape] = useState<string>('');
    const [selectedDuration, setSelectedDuration] = useState<number>(0);
    const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
    const [remainingTime, setRemainingTime] = useState<number>(0);
    const [isBreathingExpanding, setIsBreathingExpanding] = useState<boolean>(true);
    const [showModal, setShowModal] = useState<boolean>(false);
    
    // State for non-blocking error display
    const [playbackError, setPlaybackError] = useState<string | null>(null); 

    // --- REFS for DOM and Intervals/Audio ---
    const audioRef = useRef<HTMLAudioElement | null>(new Audio());
    const countdownTimerRef = useRef<number | null>(null);
    const breathingIntervalRef = useRef<number | null>(null);
    const breathingBallRef = useRef<HTMLDivElement>(null);
    const navbarRef = useRef<HTMLElement>(null);

    // --- AUDIO CONTROL FUNCTIONS ---
    const handlePlay = useCallback(() => {
        if (!selectedSoundscape) {
            setPlaybackError("Please select a soundscape first!"); 
            return;
        }
        const audio = audioRef.current;
        if (audio) {
            audio.src = selectedSoundscape;
            audio.loop = true;
            
            setPlaybackError(null); 

            audio.play().catch(e => {
                console.error("Audio playback error (possible permission issue or bad format):", e);
                // Updated message to reflect the format/loading issue as well
                setPlaybackError("Playback blocked or file format unsupported. Click 'Play' again after selecting a sound.");
            });
        }
    }, [selectedSoundscape]);

    const handlePause = useCallback(() => {
        audioRef.current?.pause();
        setPlaybackError(null); 
    }, []);

    // --- BREATHING LOGIC ---
    
    // Function to calculate and update the breathing ball size
    const updateBallSize = useCallback(() => {
        if (!breathingBallRef.current || !navbarRef.current) return;

        // Calculate maximum available space for responsiveness
        const navbarHeight = navbarRef.current.offsetHeight;
        const maxAvailableHeight = window.innerHeight - navbarHeight - 40; // some buffer
        const maxSize = Math.min(maxAvailableHeight, window.innerWidth * 0.9);

        const targetSize = isBreathingExpanding ? maxSize : 100;
        breathingBallRef.current.style.width = targetSize + 'px';
        breathingBallRef.current.style.height = targetSize + 'px';

    }, [isBreathingExpanding]);

    // Effect to handle breathing animation size transitions
    useEffect(() => {
        if (isSessionActive && currentPage === 'breathing') {
            updateBallSize();
            // Also add a listener for window resize to maintain responsiveness during the session
            window.addEventListener('resize', updateBallSize);
        } else {
            window.removeEventListener('resize', updateBallSize);
        }
        return () => window.removeEventListener('resize', updateBallSize);
    }, [isBreathingExpanding, isSessionActive, currentPage, updateBallSize]);
    
    // --- SESSION CONTROL FUNCTIONS ---

    const stopBreathingAnimation = useCallback(() => {
        // Clear interval
        if (breathingIntervalRef.current) {
            window.clearInterval(breathingIntervalRef.current);
            breathingIntervalRef.current = null;
        }
        // Reset size
        if (breathingBallRef.current) {
            breathingBallRef.current.style.width = '100px';
            breathingBallRef.current.style.height = '100px';
        }
    }, []);

    const startBreathingAnimation = useCallback(() => {
        setIsBreathingExpanding(true);
        updateBallSize();

        // Start breathing toggle interval
        breathingIntervalRef.current = window.setInterval(() => {
            setIsBreathingExpanding(prev => !prev);
        }, 4000); // 4 seconds cycle (4s expand, 4s contract)

    }, [updateBallSize]);
    
    const handleSessionEnd = useCallback(() => {
        if (countdownTimerRef.current) {
            window.clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
        }
        setIsSessionActive(false);
        stopBreathingAnimation();
        setShowModal(true);
    }, [stopBreathingAnimation]);

    const handleStopSession = useCallback(() => {
        if (countdownTimerRef.current) {
            window.clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
        }
        setIsSessionActive(false);
        setRemainingTime(0);
        stopBreathingAnimation();
        handlePause(); // Pause audio when session stops
    }, [stopBreathingAnimation, handlePause]);


    const handleStartSession = useCallback(() => {
        if (selectedDuration <= 0) {
            setPlaybackError('Please select a session duration.');
            return;
        }

        // Reset previous timers
        handleStopSession();

        setRemainingTime(selectedDuration);
        setIsSessionActive(true);
        startBreathingAnimation();

        // Start countdown timer
        let currentRemaining = selectedDuration;
        countdownTimerRef.current = window.setInterval(() => {
            currentRemaining--;
            setRemainingTime(currentRemaining);

            if (currentRemaining <= 0) {
                handleSessionEnd();
            }
        }, 1000);
    }, [selectedDuration, startBreathingAnimation, handleSessionEnd, handleStopSession]);

    // Clean up on component unmount
    useEffect(() => {
        return () => {
            if (countdownTimerRef.current) window.clearInterval(countdownTimerRef.current);
            if (breathingIntervalRef.current) window.clearInterval(breathingIntervalRef.current);
            audioRef.current?.pause();
        };
    }, []);

    // --- MODAL BUTTON HANDLERS ---
     const handleModalAction = (action: 'Journal' | 'Chat' | 'Rest') => {
        setShowModal(false);
        if (action === 'Journal') {
            window.location.href='/diary';
        } else if (action === 'Chat') {
            window.location.href = '/IB'; 
        } else if (action === 'Rest') {
            // 'Rest' simply closes the modal, stops everything, and resets the timer
            handleStopSession();
            setCurrentPage('breathing');
        }
    };
    
    // --- STUB PAGES FOR NAVIGATION ---

  
        
     
               
               

    const ChatPage: React.FC = () => (
        <div className="page-content">
            <h2 id="modalTitle">Wellness Chatbot & Image Therapy</h2>
            <p>Engage with our supportive chatbot or explore calming visuals designed to ground you.</p>
            <div className="chat-interface">
                <div className="chat-messages" style={{height: '250px', overflowY: 'auto', padding: '10px', border: '1px solid #4b4f72', borderRadius: '4px', marginBottom: '10px', background: '#383a5e'}}>
                    <p style={{marginBottom: '5px'}}>
                        <span style={{color: '#a0c4ff', fontWeight: 'bold'}}>Bot:</span> Hello! I'm here to listen. How can I support you today?
                    </p>
                    <p style={{textAlign: 'right', color: '#b9f2ff'}}>
                        <span style={{fontWeight: 'bold'}}>You:</span> I'm feeling a little overwhelmed.
                    </p>
                    <p style={{marginBottom: '5px'}}>
                        <span style={{color: '#a0c4ff', fontWeight: 'bold'}}>Bot:</span> I understand. Let's take a deep breath together. Remember the 4-7-8 technique?
                    </p>
                </div>
                <div style={{display: 'flex', gap: '5px'}}>
                    <input 
                        type="text" 
                        placeholder="Type your message..." 
                        style={{flexGrow: 1, padding: '10px', borderRadius: '4px', border: 'none', background: '#383a5e', color: '#eaeaea'}}
                    />
                    <button 
                        className="chat-send-btn"
                        style={{background: '#a0c4ff', color: '#232346', fontWeight: 'bold'}}
                        onClick={() => console.log("Message Sent! (Chatbot logic not fully implemented)")} 
                    >
                        Send
                    </button>
                </div>
            </div>
            <button 
                className="image-therapy-btn" 
                style={{marginTop: '20px', width: '100%', background: '#5c6280'}}
                onClick={() => console.log("Image Therapy activated!")} 
            >
                Start Image Therapy
            </button>
        </div>
    );


    // --- CSS STYLES ---
    const Styles = () => (
        <style>{`
            /* Reset & basics */
            * { box-sizing: border-box; }
            body { 
                margin: 0; 
                font-family: 'Inter', sans-serif; /* Set to Inter as per guidelines */
                background: #1a1a2e; 
                color: #eaeaea; 
                height: 100vh; 
                overflow: hidden; 
                display: flex; 
                flex-direction: column; 
            }
            .page-content {
                max-width: 600px;
                width: 90%;
                padding: 20px;
                background: #2e2f4f;
                border-radius: 12px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
                text-align: left;
                margin: 0 auto;
                animation: fadeIn 0.5s ease-out;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            /* Navbar fixed on top */
            .navbar {
                position: fixed;
                top: 0; left: 0;
                width: 100%;
                height: auto;
                min-height: 60px;
                background: #232346;
                display: flex;
                align-items: center;
                padding: 10px 15px;
                gap: 15px;
                z-index: 10;
                color: #eaeaea;
                flex-wrap: wrap;
            }

            .navbar h1 { margin: 0; font-size: 1.5rem; flex-shrink: 0; }

            .controls {
                display: flex;
                align-items: center;
                gap: 10px;
                flex-wrap: wrap;
                flex-grow: 1;
            }

            .controls label { font-size: 0.9rem; }

            .controls select, .controls button {
                padding: 8px 12px;
                font-size: 0.9rem;
                border-radius: 8px; /* Rounded corners for elements */
                border: none;
                outline: none;
                cursor: pointer;
                transition: transform 0.1s ease, background-color 0.3s ease;
            }
            .controls select { background: #383a5e; color: #eaeaea; }

            .controls button {
                background-color: #4b4f72;
                color: #eaeaea;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }

            .controls button:hover:not(:disabled) { 
                background-color: #5c6280; 
                transform: translateY(-1px);
            }

            .controls button:disabled { background-color: #888a9c; cursor: not-allowed; }

            /* Main content fills remaining height */
            main {
                margin-top: 60px; /* Adjust margin based on navbar height */
                flex-grow: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                overflow: auto;
                padding-top: 20px;
            }

            /* Breathing ball container */
            .breathing-section {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            /* Breathing ball styles */
            #breathingBall {
                background: rgba(100, 200, 255, 0.7);
                border-radius: 50%;
                width: 100px;
                height: 100px;
                position: relative;
                transition: width 4s ease-in-out, height 4s ease-in-out;
                box-shadow:
                    0 0 40px 20px rgba(100, 200, 255, 0.2),
                    0 0 80px 40px rgba(100, 200, 255, 0.15);
                overflow: visible;
                z-index: 5;
            }

            /* Ripple waves */
            .ripple {
                position: absolute;
                border: 3px solid rgba(100, 200, 255, 0.5);
                border-radius: 50%;
                top: 50%;
                left: 50%;
                width: 120%;
                height: 120%;
                transform: translate(-50%, -50%) scale(1);
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
                animation: ripplePulse 4s infinite;
                animation-play-state: paused;
            }

            .ripple:nth-child(2) { animation-delay: 1.3s; }
            .ripple:nth-child(3) { animation-delay: 2.6s; }

            .ripple.active {
                opacity: 1;
                animation-play-state: running;
            }

            @keyframes ripplePulse {
                0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
                50% { opacity: 0.2; }
                100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
            }

            /* Modal styles */
            .modal {
                display: none; /* Controlled by React state */
                position: fixed;
                top: 0; left: 0;
                width: 100vw;
                height: 100vh;
                background-color: rgba(0,0,0,0.8);
                justify-content: center;
                align-items: center;
                z-index: 20;
            }

            .modal-content {
                background: #2e2f4f;
                padding: 30px;
                border-radius: 12px;
                max-width: 90vw;
                text-align: center;
                box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
            }

            .modal-content button {
                margin: 5px;
                padding: 12px 20px;
                background: #a0c4ff;
                border: none;
                color: #232346;
                cursor: pointer;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: bold;
                transition: background-color 0.3s ease;
            }

            .modal-content button:hover { background: #b9f2ff; }

            /* Countdown timer */
            #countdown {
                color: #a0c4ff;
                font-weight: bold;
                min-width: 65px;
                font-size: 1.2rem;
                text-align: center;
            }
            
            /* Playback Error Display */
            .playback-error-bar {
                background: #724b4f; /* Reddish-brown for alert */
                color: #eaeaea;
                padding: 10px;
                text-align: center;
                position: fixed;
                top: 0;
                width: 100%;
                z-index: 10;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 20px;
                border-bottom-left-radius: 8px;
                border-bottom-right-radius: 8px;
            }
            .playback-error-bar button {
                background: #4b4f72;
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                cursor: pointer;
            }
        `}</style>
    );

    // --- RENDER ---
    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Styles />
            
            {/* Non-blocking Playback Error Display */}
            {playbackError && (
                <div className="playback-error-bar" style={{top: navbarRef.current?.offsetHeight || 60}}>
                    <p style={{margin: 0, fontWeight: 'bold'}}>{playbackError}</p>
                    <button onClick={() => setPlaybackError(null)}>Dismiss</button>
                </div>
            )}
            
            <nav className="navbar" ref={navbarRef}>
                <h1>SafeSpace</h1>
                
                {currentPage !== 'breathing' && (
                    <button 
                        onClick={() => {
                            setCurrentPage('breathing');
                            setPlaybackError(null);
                        }}
                        style={{ background: '#724b4f', color: '#eaeaea' }}
                    >
                        Back to Breathing
                    </button>
                )}
                
                <div className="controls" style={{ marginLeft: 'auto' }}>
                    <label htmlFor="soundscapeSelect">Soundscape:</label>
                    <select
                        id="soundscapeSelect"
                        value={selectedSoundscape}
                        onChange={(e) => {
                            setSelectedSoundscape(e.target.value);
                            setPlaybackError(null); // Clear error when changing selection
                        }}
                    >
                        {SOUNDSCAPES.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                    <button id="playBtn" onClick={handlePlay}>Play</button>
                    <button id="pauseBtn" onClick={handlePause}>Pause</button>

                    {currentPage === 'breathing' && (
                        <>
                            <label htmlFor="timerSelect">Session:</label>
                            <select
                                id="timerSelect"
                                value={selectedDuration}
                                onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
                                disabled={isSessionActive}
                            >
                                {SESSION_DURATIONS.map(d => (
                                    <option key={d.value} value={d.value}>{d.label}</option>
                                ))}
                            </select>
                            <button 
                                id="startSession" 
                                onClick={handleStartSession}
                                disabled={isSessionActive}
                            >
                                Start Session
                            </button>
                            <button 
                                id="stopSession" 
                                onClick={handleStopSession}
                                disabled={!isSessionActive}
                            >
                                Stop Session
                            </button>
                            <div id="countdown">
                                {isSessionActive ? formatTime(remainingTime) : formatTime(0)}
                            </div>
                        </>
                    )}
                </div>
            </nav>

            <main>
                {currentPage === 'breathing' && (
                    <div className="breathing-section">
                        <div 
                            id="breathingBall" 
                            ref={breathingBallRef}
                            aria-label="Breathing ball animation" 
                            role="img" 
                            aria-live="polite"
                        >
                            {/* Ripple elements dynamically get the 'active' class based on session state */}
                            <div className={`ripple ${isSessionActive ? 'active' : ''}`}></div>
                            <div className={`ripple ${isSessionActive ? 'active' : ''}`}></div>
                            <div className={`ripple ${isSessionActive ? 'active' : ''}`}></div>
                        </div>
                    </div>
                )}
                {currentPage === 'journal' && <Diary />}
                {currentPage === 'chat' && <IB />}
            </main>

            {/* Modal - Display is controlled by React state */}
            <div 
                id="promptModal" 
                className="modal" 
                style={{ display: showModal ? 'flex' : 'none' }}
                role="dialog" 
                aria-modal="true" 
                aria-labelledby="modalTitle" 
                aria-describedby="modalDesc"
            >
                <div className="modal-content">
                    <p id="modalDesc" style={{fontSize: '1.2rem', marginBottom: '20px'}}>
                        Session ended. How are you feeling now?
                    </p>
                    <button id="journalBtn" onClick={() => handleModalAction('Journal')}>Journal</button>
                    <button id="chatBtn" onClick={() => handleModalAction('Chat')}>Chatbot</button>
                    <button id="restBtn" onClick={() => handleModalAction('Rest')}>Reset SafeSpace</button>
                </div>
            </div>
        </div>
    );
};

export default SafeSpace;
