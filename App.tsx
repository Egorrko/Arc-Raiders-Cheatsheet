
import React, { useState, useEffect, useMemo } from 'react';
import { Rarity, UserProgress, ItemRequirement, ItemStatus } from './types';
import { PROJECT_PHASES, WORKSHOPS } from './constants';
import { RequirementItem } from './components/RequirementItem';
import { WorkshopCard } from './components/WorkshopCard';
import { SearchResultCard } from './components/SearchResultCard';

// Helper to init default state
const DEFAULT_STATE: UserProgress = {
  projectPhaseCompleted: 0,
  workshopLevels: WORKSHOPS.reduce((acc, ws) => ({ ...acc, [ws.id]: 1 }), {}),
};

const App: React.FC = () => {
  // --- State Management ---
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem('arc_raiders_progress_v1');
      return saved ? JSON.parse(saved) : DEFAULT_STATE;
    } catch (e) {
      console.error("Failed to load state", e);
      return DEFAULT_STATE;
    }
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Save to local storage whenever progress changes
  useEffect(() => {
    localStorage.setItem('arc_raiders_progress_v1', JSON.stringify(progress));
  }, [progress]);

  // --- Handlers ---
  const updateProjectPhase = (newPhase: number) => {
    setProgress(prev => ({
      ...prev,
      projectPhaseCompleted: newPhase
    }));
  };

  const updateWorkshopLevel = (id: string, newLevel: number) => {
    setProgress(prev => ({
      ...prev,
      workshopLevels: {
        ...prev.workshopLevels,
        [id]: newLevel
      }
    }));
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all progress?")) {
      setProgress(DEFAULT_STATE);
    }
  };

  // --- Logic: Global Item Index for Search ---
  // Calculates total needed vs remaining needed for ALL items in the database
  const itemStatusIndex = useMemo(() => {
    const index = new Map<string, ItemStatus>();

    const processRequirement = (req: ItemRequirement, sourceName: string, isFuture: boolean) => {
        const normalizedName = req.name.toLowerCase();
        const entry = index.get(normalizedName) || {
            name: req.name,
            rarity: req.rarity,
            icon: req.icon,
            totalNeeded: 0,
            remainingNeeded: 0,
            breakdown: []
        };

        entry.totalNeeded += req.count;
        if (isFuture) {
            entry.remainingNeeded += req.count;
        }
        
        entry.breakdown.push({
            source: sourceName,
            needed: isFuture,
            count: req.count
        });

        index.set(normalizedName, entry);
    };

    // Index Projects
    PROJECT_PHASES.forEach(phase => {
        const isFuture = phase.id > progress.projectPhaseCompleted;
        phase.requirements.forEach(req => processRequirement(req, `Project Phase ${phase.id}`, isFuture));
    });

    // Index Workshops
    WORKSHOPS.forEach(ws => {
        const currentLevel = progress.workshopLevels[ws.id] || 1;
        ws.levels.forEach(lvl => {
            const isFuture = lvl.level > currentLevel;
            lvl.requirements.forEach(req => processRequirement(req, `${ws.name} Lvl ${lvl.level}`, isFuture));
        });
    });

    return index;
  }, [progress]);

  // --- Search Results Calculation ---
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    const results: ItemStatus[] = [];

    // 1. Find matches in our known index
    Array.from(itemStatusIndex.values()).forEach(item => {
        if (item.name.toLowerCase().includes(query)) {
            results.push(item);
        }
    });

    // 2. If no exact match, but user typed something, we might want to show a "Safe to sell" generic card
    // Only if results are empty to avoid clutter, or maybe always at the bottom?
    // Let's stick to showing found items. If list is empty, UI will show "No requirements found -> Safe to sell"
    
    return results.sort((a, b) => b.remainingNeeded - a.remainingNeeded); // Prioritize needed items
  }, [searchQuery, itemStatusIndex]);


  // --- Logic: Shopping List (Immediate Needs Only) ---
  const shoppingList = useMemo(() => {
    const itemsMap = new Map<string, { count: number; rarity: Rarity; sources: string[]; icon?: string }>();

    // 1. Check Project Requirements
    const currentProjectPhaseIndex = progress.projectPhaseCompleted; 
    
    if (currentProjectPhaseIndex < PROJECT_PHASES.length) {
      const targetPhase = PROJECT_PHASES[currentProjectPhaseIndex];
      targetPhase.requirements.forEach(req => {
        const existing = itemsMap.get(req.name);
        const newCount = (existing?.count || 0) + req.count;
        const sources = existing ? [...existing.sources] : [];
        if (!sources.includes(`Phase ${targetPhase.id}`)) {
          sources.push(`Phase ${targetPhase.id}`);
        }
        
        itemsMap.set(req.name, {
          count: newCount,
          rarity: req.rarity,
          sources,
          icon: req.icon // Preserve icon
        });
      });
    }

    // 2. Check Workshop Requirements
    WORKSHOPS.forEach(ws => {
      const currentLevel = progress.workshopLevels[ws.id] || 1;
      const targetLevel = currentLevel + 1;
      
      // Find the specific requirements for the next level
      const levelReqs = ws.levels.find(l => l.level === targetLevel);
      
      if (levelReqs) {
        levelReqs.requirements.forEach(req => {
          const existing = itemsMap.get(req.name);
          const newCount = (existing?.count || 0) + req.count;
          const sources = existing ? [...existing.sources] : [];
          const sourceLabel = `${ws.name} L${targetLevel}`;
          
          if (!sources.includes(sourceLabel)) {
            sources.push(sourceLabel);
          }

          itemsMap.set(req.name, {
            count: newCount,
            rarity: req.rarity,
            sources,
            icon: req.icon // Preserve icon
          });
        });
      }
    });

    // Convert Map to Array and Sort
    return Array.from(itemsMap.entries()).map(([name, data]) => ({
      name,
      ...data
    })).sort((a, b) => {
        const rarityOrder = {
            [Rarity.LEGENDARY]: 5,
            [Rarity.EPIC]: 4,
            [Rarity.RARE]: 3,
            [Rarity.UNCOMMON]: 2,
            [Rarity.COMMON]: 1
        };
        const diff = rarityOrder[b.rarity] - rarityOrder[a.rarity];
        if (diff !== 0) return diff;
        return a.name.localeCompare(b.name);
    });

  }, [progress]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-orange-500 selection:text-white">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center font-bold text-white text-lg">A</div>
            <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">
              ARC Raiders <span className="text-slate-500 font-normal">Logistics</span>
            </h1>
          </div>
          <button 
            onClick={handleReset}
            className="text-xs text-red-400 hover:text-red-300 hover:underline px-3 py-1"
          >
            Reset Data
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Controls (Progress) */}
        <div className="lg:col-span-7 space-y-8 order-2 lg:order-1">
          
          {/* Expedition Project Section */}
          <section className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
            <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
                Expedition Project
              </h2>
              <span className="text-sm text-slate-400 font-mono">
                {progress.projectPhaseCompleted === 5 ? "COMPLETE" : `Current Goal: Phase ${progress.projectPhaseCompleted + 1}`}
              </span>
            </div>
            
            <div className="p-6">
               <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                    <div>
                       <p className="text-sm text-slate-400 mb-1">Status</p>
                       <h3 className="text-xl font-bold text-white">
                         {progress.projectPhaseCompleted === 5 
                           ? "All Phases Completed" 
                           : `Phase ${progress.projectPhaseCompleted + 1}: ${PROJECT_PHASES[progress.projectPhaseCompleted].name}`
                         }
                       </h3>
                    </div>
                    
                    <div className="flex items-center gap-2">
                         <button 
                            onClick={() => updateProjectPhase(Math.max(0, progress.projectPhaseCompleted - 1))}
                            disabled={progress.projectPhaseCompleted === 0}
                            className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-white font-bold transition-colors"
                         >
                            ←
                         </button>
                         <div className="px-4 font-mono text-2xl font-black text-slate-500">
                           {progress.projectPhaseCompleted} / 5
                         </div>
                         <button 
                            onClick={() => updateProjectPhase(Math.min(5, progress.projectPhaseCompleted + 1))}
                            disabled={progress.projectPhaseCompleted === 5}
                            className="p-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-30 rounded-lg text-white font-bold transition-colors"
                         >
                            Complete
                         </button>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                        className="bg-orange-500 h-full transition-all duration-500 ease-out" 
                        style={{ width: `${(progress.projectPhaseCompleted / 5) * 100}%` }}
                    />
                  </div>
               </div>
            </div>
          </section>

          {/* Workshop Upgrades Section */}
          <section className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
            <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                Workshop Upgrades
              </h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {WORKSHOPS.map(ws => (
                <WorkshopCard 
                  key={ws.id}
                  workshop={ws}
                  currentLevel={progress.workshopLevels[ws.id] || 1}
                  onLevelChange={updateWorkshopLevel}
                />
              ))}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: The "Shopping List" & Search */}
        <div className="lg:col-span-5 relative order-1 lg:order-2">
          <div className="sticky top-24 space-y-4">
            
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <span className="text-slate-500 text-lg">🔍</span>
              </div>
              <input 
                type="text" 
                placeholder="Search item (e.g. Wires, Metal Parts)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-lg placeholder-slate-500"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* SEARCH RESULTS VIEW */}
            {searchQuery ? (
              <div className="bg-slate-900/90 rounded-xl border border-slate-700 shadow-2xl overflow-hidden backdrop-blur-md">
                 <div className="bg-slate-950 p-4 border-b border-slate-800">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Search Results</h2>
                 </div>
                 <div className="p-4 max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
                    {searchResults.length > 0 ? (
                      searchResults.map((item, idx) => (
                        <SearchResultCard 
                          key={`${item.name}-${idx}`}
                          name={item.name}
                          icon={item.icon}
                          rarity={item.rarity}
                          totalNeeded={item.totalNeeded}
                          remainingNeeded={item.remainingNeeded}
                          breakdown={item.breakdown}
                        />
                      ))
                    ) : (
                      // SAFE TO SELL Generic Card
                      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-lg animate-fadeIn">
                          <div className="p-4 flex items-center gap-3 bg-slate-900/50">
                             <div className="w-12 h-12 bg-slate-800 rounded flex items-center justify-center text-2xl border border-slate-700">❓</div>
                             <div>
                                <h3 className="font-bold text-lg text-slate-200">"{searchQuery}"</h3>
                                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Unknown Item</p>
                             </div>
                          </div>
                          <div className="bg-green-600 p-3 flex items-center justify-center shadow-inner">
                            <span className="font-black text-white text-xl tracking-widest uppercase">SAFE TO SELL</span>
                          </div>
                          <div className="p-4 text-center">
                            <p className="text-sm text-slate-300">
                              This item does not appear in any known upgrade requirements.
                            </p>
                          </div>
                      </div>
                    )}
                 </div>
              </div>
            ) : (
              // SHOPPING LIST VIEW (Default)
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
                <div className="bg-slate-950 p-6 border-b border-slate-800 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Logistics Request</h2>
                    <p className="text-sm text-slate-400">Immediate requirements.</p>
                  </div>
                  <div className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                      <span className="text-orange-500 font-bold font-mono">{shoppingList.length}</span>
                      <span className="text-slate-400 text-xs ml-2 uppercase">Types</span>
                  </div>
                </div>

                <div className="p-4 max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar space-y-3">
                  {shoppingList.length === 0 ? (
                    <div className="text-center py-12 px-4 border-2 border-dashed border-slate-800 rounded-lg">
                      <p className="text-slate-500 text-lg mb-2">No active requirements</p>
                      <p className="text-slate-600 text-sm">
                        You are either fully maxed out or haven't started tracking yet.
                      </p>
                    </div>
                  ) : (
                    shoppingList.map((item, idx) => (
                      <RequirementItem 
                        key={`${item.name}-${idx}`} 
                        item={{ name: item.name, count: item.count, rarity: item.rarity, icon: item.icon }}
                        source={item.sources.join(", ")}
                      />
                    ))
                  )}
                </div>
                
                {shoppingList.length > 0 && (
                    <div className="bg-slate-950/50 p-3 text-center border-t border-slate-800">
                        <p className="text-xs text-slate-500 italic">
                          Calculated based on current Project phase and next Workshop level.
                        </p>
                    </div>
                )}
              </div>
            )}

            {/* Legend - Only show if not searching or if items present */}
            {!searchQuery && (
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                 <div className="flex items-center justify-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-500"></div>Common</div>
                 <div className="flex items-center justify-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div>Uncommon</div>
                 <div className="flex items-center justify-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div>Rare</div>
                 <div className="flex items-center justify-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div>Epic</div>
              </div>
            )}

          </div>
        </div>

      </main>
    </div>
  );
};

export default App;
