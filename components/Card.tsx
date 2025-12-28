
import React from 'react';
import { CardData } from '../types';

interface CardProps {
  card: CardData;
  onClick: (id: string) => void;
  disabled: boolean;
}

const Card: React.FC<CardProps> = ({ card, onClick, disabled }) => {
  return (
    <div 
      className={`relative w-full aspect-square perspective cursor-pointer transition-transform duration-300 ${disabled ? 'opacity-90' : 'hover:scale-105 active:scale-95'}`}
      onClick={() => !disabled && onClick(card.id)}
    >
      <div 
        className={`w-full h-full relative transition-transform duration-500 preserve-3d ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}`}
      >
        {/* Front of Card (Face Down) */}
        <div className="absolute inset-0 backface-hidden bg-white border-4 border-blue-200 rounded-2xl shadow-lg flex items-center justify-center group overflow-hidden">
          <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="text-4xl sm:text-5xl lg:text-6xl text-blue-300 font-game transform group-hover:scale-110 transition-transform">?</span>
        </div>

        {/* Back of Card (Face Up) */}
        <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl shadow-xl flex items-center justify-center text-5xl sm:text-6xl border-4 transition-colors duration-300 ${card.isMatched ? 'bg-green-100 border-green-300' : 'bg-white border-blue-400'}`}>
          <span className={`${card.isMatched ? 'animate-bounce' : ''}`}>{card.symbol}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
