
import React, { useState, useMemo } from 'react';
import { Drill, DrillResult } from '../types';
import * as Diff from 'diff';

interface FeedbackViewProps {
  result: DrillResult;
  drill: Drill;
  onClose: () => void;
}

const DiffViewer: React.FC<{ oldText: string; newText: string }> = ({ oldText, newText }) => {
  const diff = useMemo(() => Diff.diffWords(oldText, newText), [oldText, newText]);

  return (
    <div className="p-6 bg-white rounded-xl border border-slate-200 text-lg serif leading-relaxed text-slate-800 h-[600px] overflow-y-auto shadow-inner whitespace-pre-wrap">
      {diff.map((part, index) => {
        const colorClass = part.added 
          ? 'bg-emerald-100 text-emerald-900 border-b-2 border-emerald-400' 
          : part.removed 
          ? 'bg-rose-100 text-rose-900 line-through decoration-rose-400' 
          : '';
        
        return (
          <span key={index} className={colorClass}>
            {part.value}
          </span>
        );
      })}
    </div>
  );
};

const FeedbackView: React.FC<FeedbackViewProps> = ({ result, drill, onClose }) => {
  const [activeTab, setActiveTab] = useState<'feedback' | 'expert' | 'comparison'>('feedback');
  const [comparisonMode, setComparisonMode] = useState<'original' | 'expert'>('original');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getBgColor = (category: string) => {
    switch (category) {
      case 'Clarity': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Grammar': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Style': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Structure': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Ethics': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-red-600 font-bold uppercase tracking-widest text-xs">Session Complete</span>
          <h2 className="text-3xl font-black text-slate-900 mt-1 leading-tight">{drill.title}</h2>
        </div>
        <button 
          onClick={onClose}
          className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
        >
          Return to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Content Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="flex border-b border-slate-100 overflow-x-auto">
              {['feedback', 'expert', 'comparison'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-4 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
                    activeTab === tab 
                    ? 'text-red-600 border-red-600 bg-red-50/30' 
                    : 'text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab.replace(/^\w/, (c) => c.toUpperCase())}
                </button>
              ))}
            </div>

            <div className="p-8">
              {activeTab === 'feedback' && (
                <div className="space-y-8">
                  <div className="prose prose-slate max-w-none">
                    <h3 className="text-xl font-bold text-slate-800">Overall Mentorship</h3>
                    <p className="text-slate-600 italic leading-relaxed text-lg">"{result.overallEvaluation}"</p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Detailed Annotations</h4>
                    <div className="space-y-6">
                      {result.annotations.map((ann, idx) => (
                        <div key={idx} className="bg-white rounded-xl p-6 border border-slate-200 hover:border-red-200 transition-all group shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getBgColor(ann.category)}`}>
                              {ann.category}
                            </span>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6 mb-4">
                            <div className="space-y-2">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">The Problem</p>
                              <div className="p-3 bg-rose-50 rounded-lg text-rose-900 text-sm line-through decoration-rose-300 font-medium">
                                {ann.originalFragment}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Solution</p>
                              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-900 text-sm font-bold">
                                {ann.editedFragment}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex gap-3">
                            <div className="w-1 bg-slate-200 rounded-full"></div>
                            <p className="text-slate-600 text-sm leading-relaxed">
                              <span className="font-bold text-slate-800">Editorial Reasoning: </span>
                              {ann.comment}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'expert' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-slate-800">The Expert's Draft</h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master Level</span>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    A benchmark for quality. Notice the economy of words, the logical bridges between paragraphs, and the consistency of the authoritative tone.
                  </p>
                  <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 text-xl serif leading-relaxed text-slate-800 whitespace-pre-wrap shadow-inner">
                    {result.expertVersion}
                  </div>
                </div>
              )}

              {activeTab === 'comparison' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-100 p-2 rounded-xl">
                    <div className="flex gap-1 p-1">
                      <button 
                        onClick={() => setComparisonMode('original')}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                          comparisonMode === 'original' 
                          ? 'bg-white text-slate-900 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        You vs Original
                      </button>
                      <button 
                        onClick={() => setComparisonMode('expert')}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                          comparisonMode === 'expert' 
                          ? 'bg-white text-slate-900 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        You vs Expert
                      </button>
                    </div>
                    <div className="flex items-center gap-4 px-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Additions</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Deletions</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-800">
                      {comparisonMode === 'original' 
                        ? 'Visualizing your edits against the source text' 
                        : 'Comparing your choices to the senior editor'
                      }
                    </h4>
                    <DiffViewer 
                      oldText={comparisonMode === 'original' ? drill.originalText : result.userText} 
                      newText={comparisonMode === 'original' ? result.userText : result.expertVersion} 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Metrics */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl sticky top-24">
            <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              Performance Metrics
            </h3>
            
            <div className="space-y-10">
              {result.metrics.map((m, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">{m.name}</span>
                    <span className={`text-3xl font-black tabular-nums ${getScoreColor(m.score)}`}>{m.score}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 delay-300 rounded-full ${m.score >= 80 ? 'bg-emerald-500' : m.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${m.score}%` }}
                    />
                  </div>
                  <p className="mt-3 text-xs text-slate-400 leading-relaxed italic group-hover:text-slate-300 transition-colors">
                    {m.feedback}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-slate-800">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Mentor Perspective</p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "Editing is the act of subtraction. You are finding the hidden structure inside the chaos. Every redline is a step toward truth."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackView;
