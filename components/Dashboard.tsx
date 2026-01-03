
import React from 'react';
import { Drill, DrillResult } from '../types';
import DrillCard from './DrillCard';

interface DashboardProps {
  history: DrillResult[];
  drills: Drill[];
  onSelectDrill: (drill: Drill) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ history, drills, onSelectDrill }) => {
  const averageScore = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + (curr.metrics.reduce((a, b) => a + b.score, 0) / curr.metrics.length), 0) / history.length)
    : 0;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Welcome & Stats Section */}
      <section className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full -mr-20 -mt-20 opacity-50"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start justify-between">
          <div className="max-w-xl">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              Sharpen your <span className="text-red-600 italic">instincts</span>.
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Welcome back, Editor. Today's goal is deliberate practice. Avoid the crutches of autocorrect and train your eye for clarity, impact, and truth.
            </p>
            <div className="mt-8 flex gap-4">
              <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total Edits</p>
                <p className="text-2xl font-black">{history.length}</p>
              </div>
              <div className="bg-slate-100 text-slate-900 px-6 py-3 rounded-2xl border border-slate-200">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Avg Rating</p>
                <p className="text-2xl font-black">{averageScore}%</p>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block w-48">
            <div className="aspect-square bg-white border border-slate-100 shadow-xl rounded-2xl p-4 transform rotate-3 flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl">✍️</p>
                <p className="mt-2 font-bold text-xs text-slate-400 uppercase tracking-widest">No Crutches</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Drill Library */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Drill Library</h3>
            <p className="text-slate-500 text-sm mt-1">Select a challenge to begin your session.</p>
          </div>
          <div className="flex gap-2">
            {['All', 'Warm-up', 'Essay', 'Journalism'].map(filter => (
              <button 
                key={filter} 
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === 'All' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drills.map((drill) => (
            <DrillCard 
              key={drill.id} 
              drill={drill} 
              onSelect={onSelectDrill} 
            />
          ))}
        </div>
      </section>

      {/* Recent History */}
      {history.length > 0 && (
        <section>
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Recent Redlines</h3>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Exercise</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Avg Score</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.slice(0, 5).map((res, i) => {
                  const drill = drills.find(d => d.id === res.drillId);
                  const score = Math.round(res.metrics.reduce((a, b) => a + b.score, 0) / res.metrics.length);
                  return (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{drill?.title || 'Unknown Drill'}</p>
                        <p className="text-xs text-slate-400">{drill?.type}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(res.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${score >= 80 ? 'text-emerald-600' : 'text-slate-600'}`}>{score}%</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-red-600 font-bold text-xs uppercase tracking-wider hover:underline">
                          View Analysis
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
