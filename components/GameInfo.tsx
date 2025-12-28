
import React from 'react';

interface GameInfoProps {
  moves: number;
  time: number;
  feedback: string;
  isPositive: boolean;
}

const GameInfo: React.FC<GameInfoProps> = ({ moves, time, feedback, isPositive }) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-8 bg-white/80 backdrop-blur-md px-6 py-4 rounded-3xl shadow-xl border border-white mb-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <span className="text-slate-500 font-semibold uppercase tracking-wider text-xs">Time</span>
        <span className="text-2xl font-game text-blue-600">{Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</span>
      </div>
      
      <div className="h-8 w-[2px] bg-slate-200 hidden md:block" />

      <div className="flex items-center gap-2">
        <span className="text-slate-500 font-semibold uppercase tracking-wider text-xs">Moves</span>
        <span className="text-2xl font-game text-purple-600">{moves}</span>
      </div>

      <div className="h-8 w-[2px] bg-slate-200 hidden md:block" />

      <div className={`min-w-[120px] text-center font-game text-xl transition-all duration-300 transform ${feedback ? 'scale-110 opacity-100' : 'scale-90 opacity-0'} ${isPositive ? 'text-green-500' : 'text-orange-400'}`}>
        {feedback || "Get Ready!"}
      </div>
    </div>
  );
};

export default GameInfo;
