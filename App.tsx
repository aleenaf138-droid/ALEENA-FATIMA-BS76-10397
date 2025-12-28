
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Card from './components/Card';
import GameInfo from './components/GameInfo';
import { Difficulty, CardData, GameStats } from './types';
import { DIFFICULTY_SETTINGS, SYMBOLS, POSITIVE_MESSAGES, NEUTRAL_MESSAGES } from './constants';
import { getAIVictoryMessage } from './services/geminiService';

const App: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isPositiveFeedback, setIsPositiveFeedback] = useState(true);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const timerRef = useRef<number | null>(null);

  const shuffle = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initGame = (diff: Difficulty) => {
    const config = DIFFICULTY_SETTINGS[diff];
    const pairCount = (config.rows * config.cols) / 2;
    const selectedSymbols = shuffle(SYMBOLS).slice(0, pairCount);
    const gameSymbols = [...selectedSymbols, ...selectedSymbols];
    const initialCards: CardData[] = shuffle(gameSymbols).map((symbol, index) => ({
      id: `${symbol}-${index}`,
      symbol,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(initialCards);
    setDifficulty(diff);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setTime(0);
    setIsGameOver(false);
    setAiMessage(null);
    setFeedback("Good Luck!");
    setIsPositiveFeedback(true);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
  };

  const handleCardClick = (id: string) => {
    if (flippedCards.length === 2 || isGameOver) return;

    const clickedCard = cards.find(c => c.id === id);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    const newCards = cards.map(c => 
      c.id === id ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      checkMatch(newFlipped, newCards);
    }
  };

  const checkMatch = (currentFlipped: string[], currentCards: CardData[]) => {
    const [id1, id2] = currentFlipped;
    const card1 = currentCards.find(c => c.id === id1);
    const card2 = currentCards.find(c => c.id === id2);

    if (card1?.symbol === card2?.symbol) {
      // Match found
      setTimeout(() => {
        setCards(prev => prev.map(c => 
          c.id === id1 || c.id === id2 ? { ...c, isMatched: true } : c
        ));
        setMatches(prev => {
          const newMatchCount = prev + 1;
          const config = DIFFICULTY_SETTINGS[difficulty!];
          if (newMatchCount === (config.rows * config.cols) / 2) {
            handleWin();
          }
          return newMatchCount;
        });
        setFeedback(shuffle(POSITIVE_MESSAGES)[0]);
        setIsPositiveFeedback(true);
        setFlippedCards([]);
      }, 500);
    } else {
      // No match
      setTimeout(() => {
        setCards(prev => prev.map(c => 
          c.id === id1 || c.id === id2 ? { ...c, isFlipped: false } : c
        ));
        setFeedback(shuffle(NEUTRAL_MESSAGES)[0]);
        setIsPositiveFeedback(false);
        setFlippedCards([]);
      }, 1000);
    }
  };

  const handleWin = async () => {
    setIsGameOver(true);
    if (timerRef.current) clearInterval(timerRef.current);
    
    setIsAiLoading(true);
    const msg = await getAIVictoryMessage(moves + 1, time, difficulty!);
    setAiMessage(msg);
    setIsAiLoading(false);
  };

  const resetToMenu = () => {
    setDifficulty(null);
    setIsGameOver(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Helper to get grid cols class
  const getGridCols = () => {
    if (!difficulty) return 'grid-cols-4';
    const config = DIFFICULTY_SETTINGS[difficulty];
    if (config.cols === 4) return 'grid-cols-4';
    if (config.cols === 6) return 'grid-cols-4 sm:grid-cols-6';
    return 'grid-cols-3 sm:grid-cols-4';
  };

  if (!difficulty) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8 animate-fade-in-up">
          <div className="space-y-4">
            <h1 className="text-5xl font-game text-blue-600 drop-shadow-sm">Test Your Memory!</h1>
            <p className="text-slate-600 font-medium">Choose a difficulty level to start playing.</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {Object.values(DIFFICULTY_SETTINGS).map((config) => (
              <button
                key={config.name}
                onClick={() => initGame(config.name)}
                className="group relative bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-400 p-6 rounded-3xl transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-between"
              >
                <div className="text-left">
                  <h3 className="text-2xl font-game text-slate-800">{config.name}</h3>
                  <p className="text-slate-500 text-sm font-medium">{config.rows} x {config.cols} Grid</p>
                </div>
                <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  ➔
                </div>
              </button>
            ))}
          </div>

          <div className="pt-8">
            <p className="text-slate-400 text-sm italic">Created by Memory Mastermind Team</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl flex items-center justify-between mb-8">
        <button 
          onClick={resetToMenu}
          className="bg-white/50 hover:bg-white px-4 py-2 rounded-2xl text-slate-600 font-semibold transition-all border border-slate-200"
        >
          ← Menu
        </button>
        <h2 className="text-2xl font-game text-blue-600 hidden sm:block">Memory Mastermind</h2>
        <button 
          onClick={() => initGame(difficulty)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-2xl font-semibold shadow-lg shadow-blue-200 transition-all hover:-translate-y-1"
        >
          Restart
        </button>
      </header>

      <GameInfo 
        moves={moves} 
        time={time} 
        feedback={feedback} 
        isPositive={isPositiveFeedback} 
      />

      <main className={`grid ${getGridCols()} gap-3 sm:gap-4 w-full max-w-4xl animate-scale-in`}>
        {cards.map((card) => (
          <Card 
            key={card.id} 
            card={card} 
            onClick={handleCardClick}
            disabled={flippedCards.length === 2 || card.isMatched || isGameOver}
          />
        ))}
      </main>

      {/* Win Modal Overlay */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center shadow-2xl space-y-6 animate-bounce-in">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-4xl font-game text-blue-600">Congratulations!</h2>
            <p className="text-slate-600 text-lg">
              You completed the {difficulty} level in <span className="font-bold text-blue-600">{moves}</span> moves and <span className="font-bold text-blue-600">{time}</span> seconds!
            </p>
            
            <div className="bg-blue-50 rounded-2xl p-6 italic text-blue-800 border-l-4 border-blue-400">
              {isAiLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              ) : (
                aiMessage
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => initGame(difficulty)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-game text-xl py-4 rounded-2xl shadow-lg transition-all active:scale-95"
              >
                Play Again
              </button>
              <button 
                onClick={resetToMenu}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-game text-xl py-4 rounded-2xl transition-all active:scale-95"
              >
                Change Level
              </button>
            </div>
            
            <p className="text-slate-400 text-sm">Thanks for playing!</p>
          </div>
        </div>
      )}

      {/* Tailwind Animations Customization */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out; }
        .animate-scale-in { animation: scaleIn 0.5s ease-out; }
        .animate-bounce-in { animation: bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}</style>
    </div>
  );
};

export default App;
