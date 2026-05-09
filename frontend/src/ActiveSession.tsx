import { useEffect, useState, useRef } from 'react';
import { useVoice } from '@humeai/voice-react';

interface ActiveSessionProps {
  studyContext: string;
  onEndSession: (collectedTaxonomy: string[]) => void;
}

export default function ActiveSession({ studyContext, onEndSession }: ActiveSessionProps) {
  const { connect, disconnect, status, isPlaying, messages } = useVoice();
  const [taxonomyData, setTaxonomyData] = useState<string[]>([]);
  
  // Track how many messages we've already processed
  const processedLengthRef = useRef(0);

  // Listen to the Hume messages array for our specific tool call
  useEffect(() => {
    // Only process NEW messages
    if (messages.length > processedLengthRef.current) {
      for (let i = processedLengthRef.current; i < messages.length; i++) {
        const msg = messages[i];
        
        if (msg?.type === 'tool_call' && msg.name === 'classify_user_question') {
          try {
            // Check if parameters is a string before parsing
            const paramsString = typeof msg.parameters === 'string' 
              ? msg.parameters 
              : JSON.stringify(msg.parameters);
              
            const payload = JSON.parse(paramsString);
            const questionType = payload.question_type;
            
            setTaxonomyData(prev => [...prev, questionType]);
            console.log(`Captured question type: ${questionType}`);
          } catch (error) {
            console.error("Failed to parse tool call:", error);
          }
        }
      }
      // Update our ref to the current length so we don't re-process these
      processedLengthRef.current = messages.length;
    }
  }, [messages]);

  // Clean up if the user leaves the session early
  useEffect(() => {
    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // <-- Empty array ensures this ONLY runs on unmount

  const handleStartAudio = () => {
    connect({ audioConstraints: { audio: true } })
      .then(() => console.log("Microphone connected successfully!"))
      .catch((err) => console.error("Failed to connect:", err));
  }

  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[400px] w-full">
      
      {/* --- DYNAMIC VISUALIZER --- */}
      <div className="relative flex items-center justify-center mb-8 h-32 w-32 mt-4">
        {/* Outer glowing ring that pulses when AI is speaking */}
        <div 
          className={`absolute inset-0 rounded-full transition-all duration-300 ${
            isPlaying ? 'bg-blue-400 animate-ping opacity-50 scale-125' : 'bg-transparent'
          }`} 
        />
        
        {/* Core orb changes color based on state */}
        <div 
          className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-colors duration-500 shadow-lg ${
            status.value === 'connected' 
              ? isPlaying ? 'bg-blue-600 shadow-blue-500/50' : 'bg-emerald-500 shadow-emerald-500/50' 
              : 'bg-slate-200'
          }`}
        >
          {/* Icon swaps based on Listening vs Speaking vs Disconnected */}
          {status.value === 'disconnected' ? (
             // The new physical button the browser requires to open the microphone
             <button 
               onClick={handleStartAudio} 
               className="w-full h-full flex items-center justify-center rounded-full hover:bg-slate-300 transition-colors"
               title="Click to start audio"
             >
                <svg className="w-10 h-10 text-slate-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
             </button>
          ) : status.value === 'connected' ? (
            isPlaying ? (
              // AI is Speaking (Audio Wave Icon)
              <svg className="w-12 h-12 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            ) : (
              // AI is actively Listening (Microphone Icon)
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )
          ) : (
            // Connecting (Loading spinner icon)
            <svg className="w-10 h-10 text-slate-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
        </div>
      </div>
      
      {/* Dynamic Status Text */}
      <h2 className="text-2xl font-bold mb-2 text-slate-800 transition-all">
        {status.value === 'disconnected' && 'Click the play button to start'}
        {status.value === 'connecting' && 'Connecting to Tutor...'}
        {status.value === 'connected' && (isPlaying ? 'Tutor is speaking...' : 'Actively listening...')}
        {status.value === 'error' && 'Connection Error'}
      </h2>
      
      {/* Context reminder for the user */}
      <p className="text-slate-500 text-center max-w-md bg-slate-100 px-4 py-2 rounded-lg text-sm border border-slate-200 mt-2">
        Topic: <span className="font-medium text-slate-700">{studyContext}</span>
      </p>

      {/* Live Feedback (Pedagogical Taxonomy) */}
      <div className="mt-6 min-h-[32px] flex flex-wrap gap-2 justify-center max-w-sm">
        {taxonomyData.map((type, index) => (
          <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full border border-green-200 shadow-sm animate-fade-in-up">
            {type}
          </span>
        ))}
        {taxonomyData.length === 0 && status.value === 'connected' && (
          <span className="text-xs text-slate-400 italic">Waiting for your first question...</span>
        )}
      </div>
      
      <div className="mt-10 flex space-x-4">
        <button 
          onClick={() => {
            disconnect();
            onEndSession(taxonomyData);
          }}
          className="bg-white text-red-500 hover:bg-red-50 hover:text-red-600 font-semibold py-2 px-6 rounded-full transition-colors border border-red-200 shadow-sm"
        >
          End Session & View Scorecard
        </button>
      </div>
    </div>
  );
}