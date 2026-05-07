import { useState, useEffect } from 'react';

function App() {
  // State for our backend connection test (optional, keeping it for your debug peace of mind)
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  
  // State for the product flow
  const [studyContext, setStudyContext] = useState('');
  const [isSessionActive, setIsSessionActive] = useState(false);

  // Check Django connection on mount
  useEffect(() => {
    fetch('/api/get-voice-token/')
      .then((res) => res.ok ? setBackendStatus('connected') : setBackendStatus('error'))
      .catch(() => setBackendStatus('error'));
  }, []);

  const handleStartSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studyContext.trim()) return;
    
    // In the next phase, this is where we will initialize the Hume WebSocket 
    // and pass the `studyContext` into the AI's system prompt.
    setIsSessionActive(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 font-sans text-slate-900">
      
      {/* Header */}
      <header className="w-full max-w-2xl mb-12 mt-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
          Finding Your Voice
        </h1>
        <p className="text-lg text-slate-600">
          Your private space to rehearse for tomorrow's class discussion. 
          Let's figure it out together.
        </p>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {!isSessionActive ? (
          /* --- ONBOARDING FLOW --- */
          <div className="p-8">
            <form onSubmit={handleStartSession} className="space-y-6">
              <div>
                <label htmlFor="context" className="block text-sm font-semibold text-slate-700 mb-2">
                  What are we preparing for?
                </label>
                <textarea
                  id="context"
                  rows={4}
                  className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all text-base"
                  placeholder="e.g., English tomorrow, chapter 7 of The Outsiders, my teacher usually asks about themes..."
                  value={studyContext}
                  onChange={(e) => setStudyContext(e.target.value)}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={!studyContext.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
              >
                Start Practice Session
              </button>
            </form>

            {/* Subtle backend status indicator */}
            <div className="mt-6 text-center text-xs text-slate-400">
              {backendStatus === 'checking' && 'Connecting to services...'}
              {backendStatus === 'connected' && '🟢 Services online'}
              {backendStatus === 'error' && '🔴 Error connecting to backend'}
            </div>
          </div>

        ) : (
          /* --- ACTIVE SESSION UI (Placeholder) --- */
          <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-8 animate-pulse">
              {/* This is where our Hume Voice visualizer will go */}
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            
            <h2 className="text-xl font-semibold mb-2">Session Active</h2>
            <p className="text-slate-500 text-center max-w-md">
              Context loaded: <span className="italic text-slate-700">"{studyContext}"</span>
            </p>
            
            <button 
              onClick={() => setIsSessionActive(false)}
              className="mt-8 text-sm text-red-500 hover:text-red-700 font-medium"
            >
              End Session
            </button>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;