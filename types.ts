
export enum Rarity {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY' // Assumed based on gold coloring in future updates
}

export interface ItemRequirement {
  name: string;
  count: number;
  rarity: Rarity;
  icon?: string; // Emoji or URL path to image
}

export interface ProjectPhase {
  id: number;
  name: string; // e.g., "Foundation", "Core Systems"
  requirements: ItemRequirement[];
}

export interface WorkshopLevel {
  level: number;
  requirements: ItemRequirement[];
}

export interface Workshop {
  id: string;
  name: string; // e.g., "Gunsmith", "Medical Lab"
  maxLevel: number;
  levels: WorkshopLevel[];
}

export interface UserProgress {
  projectPhaseCompleted: number; // 0 means starting Phase 1. 1 means Phase 1 done, working on 2.
  workshopLevels: Record<string, number>; // key: workshopId, value: current completed level
}

export interface SourceBreakdown {
  source: string;
  needed: boolean;
  count: number;
}

export interface ItemStatus {
  name: string;
  rarity: Rarity;
  icon?: string;
  totalNeeded: number;
  remainingNeeded: number;
  breakdown: SourceBreakdown[];
}
