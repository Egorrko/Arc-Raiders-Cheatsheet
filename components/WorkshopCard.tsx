import React from 'react';
import { Workshop } from '../types';

interface WorkshopCardProps {
  workshop: Workshop;
  currentLevel: number;
  onLevelChange: (id: string, newLevel: number) => void;
}

export const WorkshopCard: React.FC<WorkshopCardProps> = ({ workshop, currentLevel, onLevelChange }) => {
  const isMaxed = currentLevel >= workshop.maxLevel;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-slate-200 text-lg">{workshop.name}</h3>
        <span className={`px-2 py-1 rounded text-xs font-bold ${isMaxed ? 'bg-green-500 text-white' : 'bg-slate-600 text-slate-300'}`}>
          {isMaxed ? 'MAX' : `Level ${currentLevel}`}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-auto">
        <button
          onClick={() => onLevelChange(workshop.id, Math.max(1, currentLevel - 1))}
          disabled={currentLevel <= 1}
          className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white py-2 rounded transition-colors text-sm font-semibold"
        >
          - Prev
        </button>
        <div className="flex flex-col items-center w-12">
          <span className="text-xs text-slate-400 uppercase">Lvl</span>
          <span className="font-mono text-xl text-white">{currentLevel}</span>
        </div>
        <button
          onClick={() => onLevelChange(workshop.id, Math.min(workshop.maxLevel, currentLevel + 1))}
          disabled={isMaxed}
          className="flex-1 bg-orange-600 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed text-white py-2 rounded transition-colors text-sm font-semibold"
        >
          Next +
        </button>
      </div>
    </div>
  );
};
