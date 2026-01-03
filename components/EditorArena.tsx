
import React, { useState, useEffect, useRef } from 'react';
import { Drill, DrillResult } from '../types';
import { evaluateEdit } from '../geminiService';

interface EditorArenaProps {
  drill: Drill;
  onCancel: () => void;
  onComplete: (result: DrillResult) => void;
}

const EditorArena: React.FC<EditorArenaProps> = ({ drill, onCancel, onComplete }) => {
  const [content, setContent] = useState(drill.originalText);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reflection, setReflection] = useState('');
  const [showReflection, setShowReflection] = useState(false);
  const [timer, setTimer] = useState(0);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleFinishAttempt = () => {
    setShowReflection(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await evaluateEdit(drill, content);
      onComplete(result);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Something went wrong analyzing your edit. Please check your API key.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentWordCount = getWordCount(content);

  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-red-600 font-bold text-xs">AI</span>
          </div>
        </div>
        <div className="text-center animate-pulse">
          <h2 className="text-2xl font-bold text-slate-800">Analyzing Your Choices...</h2>
          <p className="text-slate-500 mt-2 italic">A senior editor is reviewing your redlines.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {!showReflection ? (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <h2 className="font-bold text-lg line-clamp-1">{drill.title}</h2>
              <span className="text-slate-400 text-xs whitespace-nowrap hidden sm:inline">{drill.type} • Target: {drill.wordCount} words</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-mono">{formatTime(timer)}</span>
              </div>
              <button 
                onClick={onCancel}
                className="text-slate-400 hover:text-white text-sm transition-colors"
              >
                Exit
              </button>
            </div>
          </div>

          <div className="bg-amber-50 px-6 py-2 border-b border-amber-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              Arena Mode: Autocorrect Disabled
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Words: <span className={currentWordCount > drill.wordCount ? 'text-amber-600' : 'text-slate-600'}>{currentWordCount}</span>
            </div>
          </div>

          <div className="p-8 max-h-[70vh] overflow-y-auto">
            <textarea
              ref={editorRef}
              className="w-full min-h-[600px] p-0 text-xl serif leading-relaxed text-slate-800 focus:outline-none resize-none no-spellcheck bg-transparent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start editing..."
              autoFocus
            />
          </div>

          <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-slate-400 text-xs font-medium text-center sm:text-left">
              Professional Editing Workspace. Deliberate practice, no shortcuts.
            </div>
            <button 
              onClick={handleFinishAttempt}
              className="w-full sm:w-auto bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-all transform hover:-translate-y-1 shadow-lg active:scale-95"
            >
              Finish & Review
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto py-12 px-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Editorial Reflection</h2>
            <p className="text-slate-500 mb-6 text-sm">Before you see the feedback, articulate the main editorial decisions you made. Why did you change what you changed?</p>
            
            <textarea
              className="w-full h-40 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent mb-6 resize-none text-sm"
              placeholder="e.g., 'I prioritized tightening the passive voice in the second paragraph to improve pacing...'"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
            />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setShowReflection(false)}
                className="flex-1 py-3 text-slate-600 font-semibold hover:bg-slate-50 rounded-xl transition-colors order-2 sm:order-1"
              >
                Back to Edit
              </button>
              <button 
                onClick={handleSubmit}
                disabled={!reflection.trim()}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
              >
                Submit for Mentorship
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorArena;
