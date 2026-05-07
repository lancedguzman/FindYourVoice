import { useState, useEffect } from 'react';
import { VoiceProvider } from '@humeai/voice-react';
import ActiveSession from './ActiveSession';

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
          <VoiceProvider 
            auth={{ accessToken: tokenData?.token || 'fallback_dummy_token' }}
            // We pass the context directly as a system prompt addition
            sessionSettings={{
              systemPrompt: `You are a study tutor. The user is preparing for: ${studyContext}`
            }}
          >
            <ActiveSession 
              studyContext={studyContext} 
              onEndSession={() => setIsSessionActive(false)} 
            />
          </VoiceProvider>
        )}

      </main>
    </div>
  );
}

export default App;