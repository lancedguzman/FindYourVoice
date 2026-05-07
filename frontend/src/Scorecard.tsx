interface ScorecardProps {
  taxonomyData: string[];
  onReset: () => void;
}

const CATEGORIES = ['Clarifying', 'Connecting', 'Challenging', 'Extending', 'Meta'];

export default function Scorecard({ taxonomyData, onReset }: ScorecardProps) {
  const totalQuestions = taxonomyData.length;

  // Tally up the occurrences of each question type
  const counts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = taxonomyData.filter((t) => t === cat).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-8 w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Session Complete</h2>
        <p className="text-slate-600">Great job. Here is a breakdown of the questions you asked.</p>
      </div>

      {/* The Taxonomy Breakdown */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Question Mix</h3>
        
        {totalQuestions === 0 ? (
          <p className="text-slate-500 text-center py-4 italic">No questions detected this session.</p>
        ) : (
          <div className="space-y-4">
            {CATEGORIES.map((cat) => {
              const count = counts[cat];
              const percentage = Math.round((count / totalQuestions) * 100);
              
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{cat}</span>
                    <span className="text-slate-500">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mock Debrief Feedback (as per the brief requirements) */}
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-8">
        <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-2">Tutor Feedback</h3>
        <p className="text-blue-900 text-sm leading-relaxed">
          <strong>What went well:</strong> You asked excellent clarifying questions to pin down the exact definitions before challenging the material. <br/><br/>
          <strong>One thing to work on:</strong> Try to push for more "Extending" questions next time. Ask "What if?" to explore how the material connects to other concepts.
        </p>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={onReset}
          className="bg-slate-800 text-white hover:bg-slate-900 font-semibold py-3 px-8 rounded-full transition-colors"
        >
          Start Another Session
        </button>
      </div>
    </div>
  );
}