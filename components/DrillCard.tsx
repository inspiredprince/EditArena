
import React from 'react';
import { Drill, DrillLevel } from '../types';

interface DrillCardProps {
  drill: Drill;
  onSelect: (drill: Drill) => void;
}

const DrillCard: React.FC<DrillCardProps> = ({ drill, onSelect }) => {
  const levelColors = {
    [DrillLevel.BEGINNER]: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    [DrillLevel.INTERMEDIATE]: 'bg-amber-100 text-amber-800 border-amber-200',
    [DrillLevel.ADVANCED]: 'bg-rose-100 text-rose-800 border-rose-200',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all flex flex-col h-full group">
      <div className="flex justify-between items-start mb-4">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${levelColors[drill.level]}`}>
          {drill.level}
        </span>
        <span className="text-xs font-medium text-slate-400">{drill.type}</span>
      </div>
      
      <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-red-600 transition-colors">
        {drill.title}
      </h3>
      
      <p className="text-slate-600 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">
        {drill.description}
      </p>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
        <span className="text-xs text-slate-400 font-medium">{drill.wordCount} words</span>
        <button 
          onClick={() => onSelect(drill)}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-all transform active:scale-95"
        >
          Start Drill
        </button>
      </div>
    </div>
  );
};

export default DrillCard;
