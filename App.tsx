
import React, { useState, useEffect } from 'react';
import { Drill, DrillResult } from './types';
import { DRILLS } from './constants';
import Header from './components/Header';
import DrillCard from './components/DrillCard';
import EditorArena from './components/EditorArena';
import FeedbackView from './components/FeedbackView';
import Dashboard from './components/Dashboard';

type View = 'dashboard' | 'arena' | 'feedback';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);
  const [lastResult, setLastResult] = useState<DrillResult | null>(null);
  const [resultsHistory, setResultsHistory] = useState<DrillResult[]>([]);

  // Load history from local storage
  useEffect(() => {
    const saved = localStorage.getItem('editArenaHistory');
    if (saved) {
      setResultsHistory(JSON.parse(saved));
    }
  }, []);

  const startDrill = (drill: Drill) => {
    setSelectedDrill(drill);
    setCurrentView('arena');
  };

  const finishDrill = (result: DrillResult) => {
    setLastResult(result);
    const newHistory = [result, ...resultsHistory];
    setResultsHistory(newHistory);
    localStorage.setItem('editArenaHistory', JSON.stringify(newHistory));
    setCurrentView('feedback');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      <Header onGoHome={() => setCurrentView('dashboard')} />
      
      <main className="max-w-6xl mx-auto px-4 mt-8">
        {currentView === 'dashboard' && (
          <Dashboard 
            history={resultsHistory} 
            drills={DRILLS} 
            onSelectDrill={startDrill} 
          />
        )}

        {currentView === 'arena' && selectedDrill && (
          <EditorArena 
            drill={selectedDrill} 
            onCancel={() => setCurrentView('dashboard')}
            onComplete={finishDrill}
          />
        )}

        {currentView === 'feedback' && lastResult && selectedDrill && (
          <FeedbackView 
            result={lastResult} 
            drill={selectedDrill}
            onClose={() => setCurrentView('dashboard')}
          />
        )}
      </main>
      
      <footer className="mt-12 text-center text-slate-400 text-sm py-8 border-t border-slate-200">
        <p>© 2024 EditArena. Deliberate practice for serious editors.</p>
        <p className="mt-1 italic">Train your eye, not your autocorrect.</p>
      </footer>
    </div>
  );
};

export default App;
