import React from 'react';
import { Rarity } from '../types';

interface SourceBreakdown {
  source: string;
  needed: boolean; // true if future, false if completed
  count: number;
}

interface SearchResultCardProps {
  name: string;
  icon?: string;
  rarity?: Rarity;
  remainingNeeded: number;
  totalNeeded: number;
  breakdown: SourceBreakdown[];
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({
  name,
  icon,
  rarity,
  remainingNeeded,
  totalNeeded,
  breakdown,
}) => {
  const isUnknown = totalNeeded === 0;
  const isCompleted = totalNeeded > 0 && remainingNeeded === 0;
  const isKeep = remainingNeeded > 0;

  let statusColor = 'bg-slate-700';
  let statusText = 'UNKNOWN';
  let description = 'Not found in any Project or Workshop requirements.';

  if (isKeep) {
    statusColor = 'bg-red-500';
    statusText = `KEEP x${remainingNeeded}`;
    description = 'Required for future upgrades.';
  } else if (isCompleted) {
    statusColor = 'bg-green-500';
    statusText = 'SAFE TO SELL';
    description = 'All requirements for this item are already met.';
  } else {
    statusColor = 'bg-green-600';
    statusText = 'SAFE TO SELL';
  }

  const getRarityColor = (r?: Rarity) => {
    switch (r) {
      case Rarity.COMMON: return 'text-gray-400';
      case Rarity.UNCOMMON: return 'text-green-400';
      case Rarity.RARE: return 'text-blue-400';
      case Rarity.EPIC: return 'text-purple-400';
      case Rarity.LEGENDARY: return 'text-yellow-400';
      default: return 'text-slate-200';
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-lg mb-4 animate-fadeIn">
      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-800 rounded flex items-center justify-center text-2xl border border-slate-700">
            {icon ? (icon.includes('/') ? <img src={icon} alt={name} /> : icon) : '📦'}
          </div>
          <div>
            <h3 className={`font-bold text-lg ${getRarityColor(rarity)}`}>{name}</h3>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{rarity || 'Unknown Rarity'}</p>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`${statusColor} p-3 flex items-center justify-center shadow-inner`}>
        <span className="font-black text-white text-xl tracking-widest uppercase">{statusText}</span>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-slate-300 mb-4 text-center italic">{description}</p>

        {!isUnknown && (
          <div className="space-y-2">
            <h4 className="text-xs text-slate-500 uppercase font-bold mb-2">Usage Breakdown</h4>
            {breakdown.map((item, idx) => (
              <div key={idx} className={`flex justify-between items-center text-sm p-2 rounded ${item.needed ? 'bg-slate-700/50 border-l-2 border-red-500' : 'bg-slate-900/30 opacity-50'}`}>
                <span className={item.needed ? 'text-slate-200' : 'text-slate-500 line-through'}>{item.source}</span>
                <span className="font-mono font-bold text-slate-400">x{item.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
