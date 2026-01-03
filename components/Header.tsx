
import React from 'react';

interface HeaderProps {
  onGoHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGoHome }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={onGoHome}
        >
          <div className="w-8 h-8 bg-red-600 flex items-center justify-center rounded-sm group-hover:bg-red-700 transition-colors">
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            Edit<span className="text-red-600">Arena</span>
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button onClick={onGoHome} className="hover:text-red-600 transition-colors">Library</button>
          <button className="hover:text-red-600 transition-colors">Performance</button>
          <button className="hover:text-red-600 transition-colors">Curriculum</button>
          <div className="h-4 w-[1px] bg-slate-200"></div>
          <button className="bg-slate-900 text-white px-4 py-1.5 rounded-full hover:bg-slate-800 transition-colors">
            Profile
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
