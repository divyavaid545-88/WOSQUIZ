
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Trophy, RefreshCw, ChevronRight, Edit2, Check, X, ShieldAlert } from 'lucide-react';
import { INITIAL_TEAMS, ROUNDS } from './constants';
import { Team } from './types';
import { soundManager } from './utils/sounds';

// For canvas-confetti (loaded via script tag in index.html)
declare const confetti: any;

const App: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const currentRound = ROUNDS[currentRoundIndex];

  const handleAddPoints = useCallback((teamId: number) => {
    if (isGameOver) return;
    setTeams(prev => prev.map(t => 
      t.id === teamId ? { ...t, score: t.score + currentRound.correctPoints } : t
    ));
    soundManager.playCorrect();
  }, [currentRound, isGameOver]);

  const handleDeductPoints = useCallback((teamId: number) => {
    if (isGameOver || !currentRound.allowNegative) return;
    setTeams(prev => prev.map(t => 
      t.id === teamId ? { ...t, score: t.score + currentRound.wrongPoints } : t
    ));
    soundManager.playWrong();
  }, [currentRound, isGameOver]);

  const handleNextRound = () => {
    if (currentRoundIndex < ROUNDS.length - 1) {
      setCurrentRoundIndex(prev => prev + 1);
    } else {
      setIsGameOver(true);
    }
  };

  const resetGame = () => {
    if (window.confirm('Are you sure you want to reset the entire game? All scores will be cleared.')) {
      setTeams(INITIAL_TEAMS);
      setCurrentRoundIndex(0);
      setIsGameOver(false);
      setEditingTeamId(null);
    }
  };

  const startEdit = (team: Team) => {
    setEditingTeamId(team.id);
    setEditName(team.name);
  };

  const saveEdit = () => {
    if (editingTeamId && editName.trim()) {
      setTeams(prev => prev.map(t => t.id === editingTeamId ? { ...t, name: editName.trim() } : t));
      setEditingTeamId(null);
    }
  };

  const winner = useMemo(() => {
    if (!isGameOver) return null;
    return [...teams].sort((a, b) => b.score - a.score)[0];
  }, [isGameOver, teams]);

  useEffect(() => {
    if (isGameOver && winner) {
      soundManager.playWinner();
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  }, [isGameOver, winner]);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="w-full flex flex-col md:flex-row items-center justify-between gap-4 glass p-6 rounded-2xl shadow-xl border-t-4 border-blue-600">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-xl shadow-lg">
             <Trophy className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
              Woodland Overseas School
            </h1>
            <p className="text-slate-500 font-medium">Interactive Quiz Scorer</p>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end">
          <div className="flex items-center gap-3">
             <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Round</span>
             <div className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full font-bold border border-blue-200">
               {currentRound.name}
             </div>
          </div>
          {currentRound.allowNegative && (
             <div className="flex items-center gap-1 mt-1 text-red-500 text-xs font-bold uppercase">
               <ShieldAlert size={14} /> Negative Marking Active
             </div>
          )}
        </div>
      </header>

      {/* Main Scoring Area */}
      <main className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {teams.map((team) => (
          <div key={team.id} className="flex flex-col h-full glass rounded-3xl shadow-lg overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1">
            <div className={`${team.color} p-5 flex items-center justify-between text-white`}>
              {editingTeamId === team.id ? (
                <div className="flex items-center w-full gap-2">
                  <input
                    autoFocus
                    className="bg-white/20 border-white/40 border-2 rounded px-2 py-1 w-full text-white placeholder-white/50 focus:outline-none"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                  />
                  <button onClick={saveEdit} className="p-1 hover:bg-white/20 rounded">
                    <Check size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-black uppercase tracking-tight truncate leading-tight pr-2">
                    {team.name}
                  </h3>
                  <button onClick={() => startEdit(team)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/20 rounded flex-shrink-0">
                    <Edit2 size={16} />
                  </button>
                </>
              )}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white group relative">
              <button 
                onClick={() => startEdit(team)}
                className="absolute top-2 right-2 p-2 text-slate-300 hover:text-slate-500 transition-colors"
              >
                <Edit2 size={16} />
              </button>
              
              <div className="text-7xl font-black text-slate-800 mb-2">
                {team.score}
              </div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Points</div>
            </div>

            <div className="p-4 bg-slate-50 flex flex-col gap-2">
              <button
                onClick={() => handleAddPoints(team.id)}
                disabled={isGameOver}
                className="w-full py-4 bg-green-500 hover:bg-green-600 active:scale-95 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">+</div>
                Correct (+{currentRound.correctPoints})
              </button>
              
              <button
                onClick={() => handleDeductPoints(team.id)}
                disabled={isGameOver || !currentRound.allowNegative}
                className={`w-full py-3 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-20 ${
                  currentRound.allowNegative ? 'bg-red-500 hover:bg-red-600 active:scale-95' : 'bg-slate-300'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">-</div>
                Wrong ({currentRound.wrongPoints})
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* Footer Controls */}
      <footer className="w-full glass p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl border-b-4 border-slate-300">
        <button
          onClick={resetGame}
          className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-red-600 font-bold transition-colors uppercase tracking-widest text-sm"
        >
          <RefreshCw size={18} />
          Reset Game
        </button>

        <div className="flex items-center gap-4">
          {isGameOver ? (
            <div className="animate-pulse bg-amber-100 text-amber-700 px-6 py-3 rounded-xl font-black uppercase tracking-tighter">
              Game Complete!
            </div>
          ) : (
             <button
              onClick={handleNextRound}
              className="flex items-center gap-3 px-10 py-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 uppercase tracking-wider text-lg"
            >
              {currentRoundIndex === ROUNDS.length - 1 ? 'Show Final Result' : 'Next Round'}
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      </footer>

      {/* Winner Modal */}
      {isGameOver && winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="glass max-w-2xl w-full p-12 rounded-[3rem] shadow-2xl flex flex-col items-center text-center animate-in zoom-in duration-500">
            <div className="w-32 h-32 bg-amber-400 rounded-full flex items-center justify-center shadow-2xl mb-8 animate-bounce">
              <Trophy className="text-white w-20 h-20" />
            </div>
            
            <h2 className="text-4xl font-black text-slate-800 mb-2">CONGRATULATIONS!</h2>
            <div className="text-6xl md:text-7xl font-black text-blue-600 mb-6 drop-shadow-lg">
              {winner.name}
            </div>
            
            <div className="text-2xl font-bold text-slate-500 mb-10">
              Score: <span className="text-slate-800 font-black text-4xl">{winner.score}</span> Points
            </div>

            <div className="flex gap-4">
              <button
                onClick={resetGame}
                className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xl shadow-lg transition-transform active:scale-95"
              >
                Start New Game
              </button>
              <button
                onClick={() => setIsGameOver(false)}
                className="px-10 py-5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-2xl font-bold text-xl transition-transform active:scale-95"
              >
                View Scores
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
