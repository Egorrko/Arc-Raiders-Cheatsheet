import React from 'react';
import { ItemRequirement, Rarity } from '../types';

interface RequirementItemProps {
  item: ItemRequirement;
  source?: string; // Optional: show where this is needed
}

export const RequirementItem: React.FC<RequirementItemProps> = ({ item, source }) => {
  const getRarityColors = (rarity: Rarity) => {
    switch (rarity) {
      case Rarity.COMMON:
        return 'border-gray-500 text-gray-200 bg-gray-900/40 shadow-gray-900/20';
      case Rarity.UNCOMMON:
        return 'border-green-500 text-green-200 bg-green-900/40 shadow-green-900/20';
      case Rarity.RARE:
        return 'border-blue-500 text-blue-200 bg-blue-900/40 shadow-blue-900/20';
      case Rarity.EPIC:
        return 'border-purple-500 text-purple-200 bg-purple-900/40 shadow-purple-900/20';
      case Rarity.LEGENDARY:
        return 'border-yellow-500 text-yellow-200 bg-yellow-900/40 shadow-yellow-900/20';
      default:
        return 'border-gray-500 text-gray-200';
    }
  };

  const getRarityLabel = (rarity: Rarity) => {
    switch (rarity) {
      case Rarity.COMMON: return 'bg-gray-600';
      case Rarity.UNCOMMON: return 'bg-green-600';
      case Rarity.RARE: return 'bg-blue-600';
      case Rarity.EPIC: return 'bg-purple-600';
      case Rarity.LEGENDARY: return 'bg-yellow-600';
    }
  };

  // Helper to determine if icon is an image URL or emoji
  const isImageUrl = (icon: string) => icon.includes('/') || icon.includes('.');

  return (
    <div className={`relative flex items-center justify-between p-3 border-l-4 rounded-r shadow-lg backdrop-blur-sm transition-all hover:scale-[1.02] ${getRarityColors(item.rarity)}`}>
      <div className="flex items-center gap-3 overflow-hidden">
        {/* Icon / Image Section */}
        {item.icon && (
          <div className="flex-shrink-0 w-10 h-10 bg-slate-950/30 rounded flex items-center justify-center text-2xl border border-white/10">
            {isImageUrl(item.icon) ? (
              <img src={item.icon} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <span>{item.icon}</span>
            )}
          </div>
        )}
        
        <div className="flex flex-col overflow-hidden">
          <span className="font-bold text-lg leading-tight truncate pr-2">{item.name}</span>
          {source && <span className="text-xs opacity-60 mt-1 uppercase tracking-wide truncate">{source}</span>}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0 pl-2">
        <div className={`text-xs px-2 py-0.5 rounded font-bold uppercase text-white tracking-wider hidden sm:block ${getRarityLabel(item.rarity)}`}>
          {item.rarity}
        </div>
        <div className="text-2xl font-black font-mono w-12 text-right">
          x{item.count}
        </div>
      </div>
    </div>
  );
};
