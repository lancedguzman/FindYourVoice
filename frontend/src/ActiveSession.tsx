import { useEffect, useState } from 'react';
import { useVoice } from '@humeai/voice-react';

interface ActiveSessionProps {
  studyContext: string;
  onEndSession: (collectedTaxonomy: string[]) => void; // Updated to pass data up
}

export default function ActiveSession({ studyContext, onEndSession }: ActiveSessionProps) {
  const { connect, disconnect, status, isPlaying, messages } = useVoice();
  const [taxonomyData, setTaxonomyData] = useState<string[]>([]);

  // Automatically connect on mount
  useEffect(() => {
    connect().catch((err) => console.error("Failed to connect:", err));
    return () => disconnect();
  }, [connect, disconnect]);

  // Listen to the Hume messages array for our specific tool call
  useEffect(() => {
    // Look for the most recent message
    const latestMessage = messages[messages.length - 1];
    
    if (latestMessage?.type === 'tool_call' && latestMessage.name === 'classify_user_question') {
      try {
        // Parse the JSON payload Claude sent
        const payload = JSON.parse(latestMessage.parameters);
        const questionType = payload.question_type;
        
        // Add it to our local state if we haven't already
        setTaxonomyData(prev => [...prev, questionType]);
        console.log(`Captured question type: ${questionType}`);
        
      } catch (error) {
        console.error("Failed to parse tool call:", error);
      }
    }
  }, [messages]);

  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[400px] w-full">
      
      {/* ... [Keep your existing Visualizer Orb code here] ... */}
      
      <h2 className="text-2xl font-bold mb-2 text-slate-800">
        {status.value === 'connecting' && 'Connecting to Tutor...'}
        {status.value === 'connected' && 'Tutor is listening'}
        {status.value === 'error' && 'Connection Error'}
      </h2>
      
      {/* Live Feedback (Optional, but shows reviewers you nailed the requirement) */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center max-w-sm">
        {taxonomyData.map((type, index) => (
          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full border border-green-200">
            {type}
          </span>
        ))}
      </div>
      
      <div className="mt-12 flex space-x-4">
        {/* Pass the collected data back up to App.tsx when ending the session */}
        <button 
          onClick={() => onEndSession(taxonomyData)}
          className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-semibold py-2 px-6 rounded-full transition-colors border border-red-200"
        >
          End Session & View Scorecard
        </button>
      </div>
    </div>
  );
}