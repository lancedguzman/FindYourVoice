import { useState, useEffect } from 'react';
import { VoiceProvider } from '@humeai/voice-react';
import ActiveSession from './ActiveSession';
import Scorecard from './Scorecard'; // Import the new component

// Define our three application states
type AppState = 'onboarding' | 'active' | 'scorecard';

function App() {
  const [appState, setAppState] = useState<AppState>('onboarding');
  const [studyContext, setStudyContext] = useState('');
  const [tokenData, setTokenData] = useState<any>(null);
  const [finalTaxonomy, setFinalTaxonomy] = useState<string[]>([]);

  // Fetch token on mount
  useEffect(() => {
    fetch('/api/get-voice-token/')
      .then((res) => res.json())
      .then((data) => setTokenData(data))
      .catch((err) => console.error(err));
  }, []);

  const handleStartSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (studyContext.trim()) setAppState('active');
  };

  const handleEndSession = (collectedTaxonomy: string[]) => {
    setFinalTaxonomy(collectedTaxonomy);
    setAppState('scorecard');
  };

  const handleReset = () => {
    setStudyContext('');
    setFinalTaxonomy([]);
    setAppState('onboarding');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 font-sans text-slate-900">
      <header className="w-full max-w-2xl mb-12 mt-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
          Finding Your Voice
        </h1>
        <p className="text-lg text-slate-600">
          Your private space to rehearse for tomorrow's class discussion.
        </p>
      </header>

      <main className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {appState === 'onboarding' && (
          <div className="p-8">
            <form onSubmit={handleStartSession} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  What are we preparing for?
                </label>
                <textarea
                  rows={4}
                  className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="e.g., English tomorrow, chapter 7 of The Outsiders..."
                  value={studyContext}
                  onChange={(e) => setStudyContext(e.target.value)}
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={!studyContext.trim() || !tokenData}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-3 px-6 rounded-xl"
              >
                Start Practice Session
              </button>
            </form>
          </div>
        )}

        {appState === 'active' && (
          <VoiceProvider 
            auth={{ accessToken: tokenData?.token || '' }}
            configId={import.meta.env.VITE_HUME_CONFIG_ID} 
            sessionSettings={{
              systemPrompt: `The user is preparing for: ${studyContext}`
            }}
          >
            <ActiveSession 
              studyContext={studyContext} 
              onEndSession={handleEndSession} 
            />
          </VoiceProvider>
        )}

        {appState === 'scorecard' && (
          <Scorecard 
            taxonomyData={finalTaxonomy} 
            onReset={handleReset} 
          />
        )}

      </main>
    </div>
  );
}

export default App;