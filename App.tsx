
import { Recipe } from './types';
import React, { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } from 'react';
import { RECIPES } from './constants';

const CORRECT_PASSWORD = '333';
const PRIMARY_COLOR = '#5C5C78';

// --- UI Framework Icons ---
const BackIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>;

const RecipeIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? PRIMARY_COLOR : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    {active && <line x1="8" x2="16" y1="6" y2="6" strokeWidth="1.5" />}
    {active && <line x1="8" x2="16" y1="10" y2="10" strokeWidth="1.5" />}
  </svg>
);

const MenuIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? PRIMARY_COLOR : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <path d="M3 6h.01" strokeWidth="3" />
    <path d="M3 12h.01" strokeWidth="3" />
    <path d="M3 18h.01" strokeWidth="3" />
  </svg>
);

const SearchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ResetIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 4v6h-6" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

const YouTubeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const SecretStarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#5C5C78]">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const BasketIcon = ({ active }: { active: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "3" : "2"}>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const ChefHatIcon = ({ active }: { active: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "3" : "2"}>
    <path d="M6 13.8V21h12v-7.2" />
    <path d="M9 21v-3" />
    <path d="M15 21v-3" />
    <path d="M12 3c-4.4 0-8 3.6-8 8 0 .8.2 1.6.5 2.3.4.9 1 1.7 1.8 2.3l1.7-1.7V5h8v8.9l1.7 1.7c.8-.6 1.4-1.4 1.8-2.3.3-.7.5-1.5.5-2.3 0-4.4-3.6-8-8-8Z" />
  </svg>
);

const CollectionIcon = ({ active, className = "" }: { active: boolean, className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <img 
      src={active ? "Bookmark_on.svg" : "Bookmark_off.svg"} 
      className="w-full h-full object-contain opacity-100"
      alt="Bookmark"
    />
  </div>
);

// --- Helper Functions ---
const getRecipeIcon = (name: string, category: string, className?: string) => {
  const finalClass = className || "w-20 h-20 object-contain";
  switch (category) {
    case '中式甜點': return <img src="Chinese_desserts.svg" className={finalClass} alt="Chinese Dessert" />;
    case '西式甜點': return <img src="cake.svg" className={finalClass} alt="Western Dessert" />;
    case '自製醬餡': return <img src="jam.svg" className={finalClass} alt="Sauce/Jam" />;
    case '飲品': return <img src="cocktails.svg" className={finalClass} alt="Drinks" />; 
    case '豆腐料理': return <img src="tofu.svg" className={finalClass} alt="Tofu" />;
    case '麵類料理': return <img src="noodle.svg" className={finalClass} alt="Noodles" />;
    case '飯類料理': return <img src="rice.svg" className={finalClass} alt="Rice" />;
    case '肉類料理': return <img src="meat.svg" className={finalClass} alt="Meat" />;
    case '海鮮料理': return <img src="seafood.svg" className={finalClass} alt="Seafood" />;
    case '蛋類料理': return <img src="egg.svg" className={finalClass} alt="Egg" />;
    case '蔬食料理': return <img src="vegetable.svg" className={finalClass} alt="Vegetable" />;
    case '湯品鍋物': return <img src="soup.svg" className={finalClass} alt="Soup" />;
    default: return <img src="soup.svg" className={finalClass} alt="Default" />;
  }
};

const getCategoryMiniIcon = (category: string) => {
  const commonProps = {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "transition-all duration-300 flex-shrink-0"
  } as const;

  switch (category) {
    case '全部': return (
      <svg {...commonProps}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    );
    case '肉類料理': return (
      <svg {...commonProps}>
        <path d="M12 2c3.5 0 9 2.5 9 10s-5.5 10-9 10-9-2.5-9-10 5.5-10 9-10z" />
        <path d="M12 22s2-4 2-10-2-10-2-10" />
      </svg>
    );
    case '海鮮料理': return (
      <svg {...commonProps}>
        <path d="M2 12s5-7 10-7 10 7 10 7-5 7-10 7-10-7-10-7Z" />
        <path d="M12 5v14" />
      </svg>
    );
    case '蔬食料理': return (
      <svg {...commonProps}>
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 21 2c-1 5-1.5 5.5-1 11.2A7 7 0 0 1 11 20Z" />
        <path d="M11 13v7" />
      </svg>
    );
    case '湯品鍋物': return (
      <svg {...commonProps}>
        <path d="M3 12h18" />
        <path d="M6 12c0 4.4 3.6 8 8 8s8-3.6 8-8" />
        <path d="M9 7c0-2 1-3 3-3" />
        <path d="M15 7c0-2 1-3 3-3" />
      </svg>
    );
    case '蛋類料理': return (
      <svg {...commonProps}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    );
    case '豆腐料理': return (
      <svg {...commonProps}>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M9 4v16" />
        <path d="M15 4v16" />
        <path d="M4 9h16" />
        <path d="M4 15h16" />
      </svg>
    );
    case '麵類料理': return (
      <svg {...commonProps}>
        <path d="M22 12s-3-4-10-4-10 4-10 4" />
        <path d="M2 12c0 5.5 4.5 10 10 10s10-4.5 10-10" />
        <path d="M7 8V4" />
        <path d="M12 8V4" />
        <path d="M17 8V4" />
      </svg>
    );
    case '飯類料理': return (
      <svg {...commonProps}>
        <path d="M3 12h18" />
        <path d="M3 12c0 5 4 9 9 9s9-4 9-9" />
        <path d="M12 3c3 0 6 3 6 6H6c0-3 3-6 6-6Z" />
      </svg>
    );
    case '中式甜點': return (
      <svg {...commonProps}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2v20" />
        <path d="M2 12h20" />
      </svg>
    );
    case '西式甜點': return (
      <svg {...commonProps}>
        <path d="m20 10-8-8-8 8v10h16V10Z" />
        <path d="M4 14h16" />
      </svg>
    );
    case '自製醬餡': return (
      <svg {...commonProps}>
        <path d="M6 18h12v3a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-3Z" />
        <path d="M8 18v-8h8v8" />
        <path d="M7 6h10" />
      </svg>
    );
    case '飲品': return (
      <svg {...commonProps}>
        <path d="M18 2h-3L7 11.1c-1.1 1.2-1.1 3 0 4.1L12.9 21c1.2 1.1 3 1.1 4.1 0L22 16" />
        <path d="m11 15 4 4" />
        <path d="m15 11 4 4" />
      </svg>
    );
    default: return null;
  }
};

const getRecipeColor = (category: string) => {
  switch (category) {
    case '自製醬餡': return 'bg-[#EDE3D7] text-[#5A4632]';
    case '飲品': return 'bg-[#EEF2F6] text-[#2F3E4E]';
    case '中式甜點': return 'bg-[#F6E7E2] text-[#6A3F3A]';
    case '西式甜點': return 'bg-[#F1EDF7] text-[#4B3F63]';
    case '豆腐料理': return 'bg-[#F1F5E9] text-[#4C5A3E]';
    case '麵類料理': return 'bg-[#E6E1DC] text-[#4A4A4A]';
    case '飯類料理': return 'bg-[#F5F1EB] text-[#4F4B45]';
    case '海鮮料理': return 'bg-[#E8F0EE] text-[#2F4F4F]';
    case '蛋類料理': return 'bg-[#FFF3D9] text-[#6A5A3C]';
    case '肉類料理': return 'bg-[#F2A19A] text-[#4A2E2B]';
    case '湯品鍋物': return 'bg-[#EFE9E4] text-[#5A4A42]';
    default: return 'bg-[#EAF3E6] text-[#3F5A3C]';
  }
};

const CATEGORIES = [
  '全部', '肉類料理', '海鮮料理', '蔬食料理', '湯品鍋物', '蛋類料理', '豆腐料理', '麵類料理', '飯類料理', '中式甜點', '西式甜點', '自製醬餡', '飲品'
];

// --- Sub-Components ---
const StickerTag: React.FC<{ label: string, color: string, className?: string }> = ({ label, color, className }) => (
  <div className={`
    absolute z-[110] px-3 py-1.5 
    text-[10px] font-black uppercase tracking-widest 
    shadow-[2px_2px_8px_-1px_rgba(0,0,0,0.1)] 
    rotate-[4deg] origin-center
    pointer-events-none
    ${color} ${className}
  `}>
    {label}
    <div className="absolute bottom-0 right-0 w-2 h-2 bg-black/5" />
  </div>
);

const RecipeDetail: React.FC<{ 
  selectedIndex: number;
  onClose: () => void;
  checkedIngredients: Record<string, boolean>;
  onToggleIngredient: (id: string) => void;
  onResetIngredients: (ids: string[]) => void;
  recipes: Recipe[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}> = ({ selectedIndex, onClose, checkedIngredients, onToggleIngredient, onResetIngredients, recipes, favorites, onToggleFavorite }) => {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps'>('ingredients');
  const [currentCardIndex, setCurrentCardIndex] = useState(selectedIndex);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const performScroll = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const card = container.children[selectedIndex] as HTMLElement;
        if (card) {
          container.scrollTo({ left: card.offsetLeft, behavior: 'auto' });
          setCurrentCardIndex(selectedIndex);
        }
      }
    };
    requestAnimationFrame(() => { requestAnimationFrame(performScroll); });
  }, [selectedIndex]);

  const handleHorizontalScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = container.clientWidth;
    if (cardWidth === 0) return;
    const newIndex = Math.round(container.scrollLeft / cardWidth);
    if (newIndex !== currentCardIndex && newIndex >= 0 && newIndex < recipes.length) {
      setCurrentCardIndex(newIndex);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] bg-[#FDFBF7] overflow-hidden font-sans max-w-md mx-auto shadow-2xl">
      <div className="h-full relative flex flex-col bg-white">
        <button onClick={onClose} className="fixed top-8 left-6 z-[650] p-3 bg-white/95 backdrop-blur-md rounded-2xl text-gray-900 shadow-xl active:scale-90 transition-transform">
          <BackIcon />
        </button>
        <div ref={scrollContainerRef} onScroll={handleHorizontalScroll} className="flex-1 flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory hide-scrollbar flex-nowrap">
          {recipes.map((recipe) => {
            const recipeColor = getRecipeColor(recipe.category);
            const recipeIngIds = recipe.ingredients.map(i => i.id);
            const hasCheckedIngredients = recipeIngIds.some(id => checkedIngredients[id]);
            const isFavorite = favorites.includes(recipe.id);

            return (
              <div key={recipe.id} className="w-full h-full flex-shrink-0 snap-center flex flex-col">
                <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col pb-44 search-scroll-target">
                  <div className="relative w-full aspect-[4/3] flex-shrink-0 bg-gray-50 flex items-center justify-center overflow-visible border-b border-gray-100">
                    <div className="relative transform scale-[1.2] flex items-center justify-center">
                      {getRecipeIcon(recipe.name, recipe.category)}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-20" />
                    <StickerTag label={recipe.category} color={recipeColor} className="bottom-12 right-6" />
                  </div>
                  
                  <div className="px-8 pb-12 -mt-16 relative z-[80]">
                    <div className="bg-white rounded-[40px] p-2">
                      <div className="flex justify-between items-start mb-1 gap-4">
                        <h1 className="text-3xl font-serif font-bold text-gray-900 leading-tight flex-1">
                          {recipe.name}
                        </h1>
                        <button 
                          onClick={() => onToggleFavorite(recipe.id)}
                          className="mt-1 p-1 active:scale-90 transition-all bg-gray-50 rounded-2xl border border-white shadow-sm overflow-hidden"
                        >
                          <CollectionIcon active={isFavorite} className="w-14 h-14" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5C5C78]">Recipe Date</span>
                        <span className="text-[12px] font-bold text-gray-400">{recipe.date}</span>
                      </div>

                      <p className="text-gray-500 text-[13px] leading-relaxed mb-8 border-l-2 border-gray-100 pl-4 whitespace-pre-wrap">{recipe.description}</p>
                      
                      <div className="relative flex gap-1 p-1.5 bg-gray-100/60 backdrop-blur-sm rounded-[24px] mb-8 border border-gray-200/50">
                        <div 
                          className="absolute h-[calc(100%-12px)] w-[calc(50%-6px)] bg-white shadow-md rounded-[18px] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-0 border-b-2 border-gray-50" 
                          style={{ transform: `translateX(${activeTab === 'ingredients' ? '0' : '100%'})` }} 
                        />
                        
                        <button 
                          onClick={() => setActiveTab('ingredients')} 
                          className={`relative z-10 flex-1 py-3.5 flex items-center justify-center gap-2.5 font-black text-[10px] tracking-[0.15em] transition-all duration-300 ${activeTab === 'ingredients' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-500'}`}
                        >
                          <BasketIcon active={activeTab === 'ingredients'} />
                          ITEMS ({recipe.ingredients.length})
                        </button>
                        
                        <button 
                          onClick={() => setActiveTab('steps')} 
                          className={`relative z-10 flex-1 py-3.5 flex items-center justify-center gap-2.5 font-black text-[10px] tracking-[0.15em] transition-all duration-300 ${activeTab === 'steps' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-500'}`}
                        >
                          <ChefHatIcon active={activeTab === 'steps'} />
                          STEPS ({recipe.steps.length})
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {activeTab === 'ingredients' ? (
                          <>
                            <div className={`flex justify-end transition-all duration-300 overflow-hidden ${hasCheckedIngredients ? 'max-h-12 opacity-100 mb-2' : 'max-h-0 opacity-0'}`}>
                              <button onClick={() => onResetIngredients(recipeIngIds)} className="flex items-center gap-2 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-[#5C5C78] hover:text-[#4A4A64] active:scale-95 transition-all"><ResetIcon />Reset Checklist</button>
                            </div>
                            {recipe.ingredients.map((ing) => {
                              const isChecked = checkedIngredients[ing.id];
                              return (
                                <div key={ing.id} onClick={() => onToggleIngredient(ing.id)} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/60 border border-transparent active:border-gray-200 transition-all cursor-pointer">
                                  <div className="flex items-center gap-4">
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isChecked ? 'bg-[#5C5C78] border-[#5C5C78]' : 'border-gray-200'}`}>{isChecked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>}</div>
                                    <span className={`text-sm font-semibold ${isChecked ? 'text-gray-300 line-through' : 'text-gray-800'}`}>
                                      {ing.name}
                                    </span>
                                  </div>
                                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{ing.amount}</span>
                                </div>
                              );
                            })}
                          </>
                        ) : (
                          <div className="space-y-6 pt-4">
                            {recipe.youtubeUrl && (
                              <a 
                                href={recipe.youtubeUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 w-full py-2.5 mb-4 bg-[#FF0000]/5 border border-[#FF0000]/10 rounded-xl text-[#FF0000] active:scale-[0.98] transition-all"
                              >
                                <YouTubeIcon />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Watch Video Guide</span>
                              </a>
                            )}
                            {recipe.steps.map((step, i) => (
                              <div key={i} className="flex gap-4 items-start">
                                <div className="w-6 h-6 rounded-lg bg-[#5C5C78] text-white flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">{i + 1}</div>
                                <p className="text-gray-600 text-[14px] font-medium leading-relaxed">{step}</p>
                              </div>
                            ))}
                            {recipe.tips && (
                              <div className="mt-36 relative">
                                <div className="absolute -top-4 left-6 z-20">
                                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#EFE9E4] rounded-lg shadow-sm">
                                    <SecretStarIcon />
                                    <span className="text-[#5C5C78] text-[9px] font-black tracking-[0.25em] uppercase">Secret Tip</span>
                                  </div>
                                </div>
                                <div className="bg-gradient-to-br from-[#F9F7F2] to-[#FDFBF7] rounded-3xl p-8 pt-12 relative overflow-hidden group shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
                                  <div className="absolute -bottom-10 -right-10 opacity-[0.05] grayscale scale-[2.5] rotate-[-15deg] pointer-events-none transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-[-20deg]">
                                    {getRecipeIcon(recipe.name, recipe.category, "w-32 h-32 object-contain")}
                                  </div>
                                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#5C5C78]/5 rounded-full -mr-12 -mt-12 transition-transform duration-700 group-hover:scale-110" />
                                  <p className="text-[#4A4A4A] text-[13px] font-semibold leading-[1.8] tracking-tight whitespace-pre-wrap relative z-10">{recipe.tips}</p>
                                  <div className="mt-4 flex justify-end opacity-20 relative z-10">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const LoginView: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const handleVerify = () => {
    if (pin === CORRECT_PASSWORD) onLogin();
    else { setError(true); setTimeout(() => { setError(false); setPin(''); }, 600); }
  };
  useEffect(() => { if (pin.length === 3) handleVerify(); }, [pin]);
  return (
    <div className="h-[100dvh] bg-[#FDFBF7] flex flex-col items-center justify-between py-24 px-8 font-sans max-w-md mx-auto relative overflow-hidden">
      <div className="flex flex-col items-center text-center">
        <div className="mb-8 drop-shadow-2xl">
          <img src="chef_blue.svg" className="w-24 h-24 object-contain" alt="Logo" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-3">Kitchen Vault</h1>
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em]">The Black Book</p>
      </div>
      <div className="flex-1 flex items-center justify-center w-full">
        <div className={`grid grid-cols-3 gap-6 w-full max-w-[280px] ${error ? 'animate-shake' : ''}`}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((k, i) => (
            <button key={i} disabled={!k} onClick={() => k === '⌫' ? setPin(p => p.slice(0, -1)) : setPin(p => p + k)} className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-xl font-bold transition-all active:scale-90 ${!k ? 'opacity-0' : `bg-white shadow-sm border border-gray-100 ${error ? 'text-red-500' : 'text-gray-900'}`}`}>{k}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<'recipes' | 'menu'>('recipes');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [categoryIndicatorStyle, setCategoryIndicatorStyle] = useState({ left: 0, width: 0 });
  
  // 搜尋功能相關 State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollMemoryRef = useRef<number>(0);

  const navRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const touchStartRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem('kitchen_auth') === 'true') setIsAuth(true);
    const savedChecked = localStorage.getItem('kitchen_checked_v8');
    if (savedChecked) setCheckedIngredients(JSON.parse(savedChecked));
    const savedFavorites = localStorage.getItem('kitchen_favorites_v11');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  // 新增：切換分頁時自動捲動至頂端
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  useEffect(() => {
    const updateIndicator = () => {
      const activeBtn = categoryRefs.current[selectedCategory];
      if (activeBtn && activeTab === 'recipes') {
        setCategoryIndicatorStyle({ left: activeBtn.offsetLeft, width: activeBtn.offsetWidth });
        if (navRef.current) {
          const containerWidth = navRef.current.offsetWidth;
          const btnOffset = activeBtn.offsetLeft;
          const btnWidth = activeBtn.offsetWidth;
          navRef.current.scrollTo({ left: btnOffset - (containerWidth / 2) + (btnWidth / 2), behavior: 'smooth' });
        }
      }
    };
    requestAnimationFrame(updateIndicator);
  }, [selectedCategory, activeTab, isAuth]);

  // --- Search Logic ---
  
  const clearHighlights = useCallback(() => {
    const container = document.getElementById('recipes-container');
    const detailContainer = document.querySelector('.fixed.inset-0.z-\\[600\\]');
    const targets = [container, detailContainer].filter(Boolean);

    targets.forEach(target => {
      if (!target) return;
      const highlights = target.querySelectorAll('mark.search-highlight');
      highlights.forEach(h => {
        const parent = h.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(h.textContent || ''), h);
          parent.normalize();
        }
      });
      const helperSpans = target.querySelectorAll('span[data-search-helper]');
      helperSpans.forEach(span => {
        const parent = span.parentNode;
        if (parent) {
          while(span.firstChild) parent.insertBefore(span.firstChild, span);
          parent.removeChild(span);
          parent.normalize();
        }
      });
    });
  }, []);

  const highlightText = useCallback((query: string) => {
    clearHighlights();
    const cleanQuery = query.trim();
    if (!cleanQuery) return;

    const container = document.getElementById('recipes-container');
    const detailContainer = document.querySelector('.fixed.inset-0.z-\\[600\\]');
    const targets = [container, detailContainer].filter(Boolean);

    targets.forEach(target => {
      if (!target) return;
      const walk = document.createTreeWalker(target, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE' || parent.tagName === 'MARK' || parent.getAttribute('aria-hidden') === 'true')) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      });

      const nodes: Text[] = [];
      let node;
      while (node = walk.nextNode()) nodes.push(node as Text);

      const regex = new RegExp(`(${cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');

      nodes.forEach(textNode => {
        const text = textNode.nodeValue || '';
        if (regex.test(text)) {
          const span = document.createElement('span');
          span.setAttribute('data-search-helper', 'true');
          span.innerHTML = text.replace(regex, '<mark class="search-highlight">$1</mark>');
          textNode.parentNode?.replaceChild(span, textNode);
        }
      });
    });

    // 智慧導航：搜尋後自動捲動到第一個匹配結果
    requestAnimationFrame(() => {
      const detailModal = document.querySelector('.fixed.inset-0.z-\\[600\\]');
      let firstMark: HTMLElement | null = null;
      
      if (detailModal) {
        const swiper = detailModal.querySelector('.flex-1.flex.overflow-x-auto');
        if (swiper) {
          const width = swiper.clientWidth;
          const currentIndex = Math.round(swiper.scrollLeft / width);
          const activeCard = swiper.children[currentIndex];
          if (activeCard) {
            firstMark = activeCard.querySelector('mark.search-highlight') as HTMLElement;
          }
        }
        
        if (!firstMark) {
          firstMark = detailModal.querySelector('mark.search-highlight') as HTMLElement;
        }
      }

      if (!firstMark) {
        firstMark = document.querySelector('#recipes-container mark.search-highlight') as HTMLElement;
      }

      if (firstMark) {
        firstMark.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }, [clearHighlights]);

  const filteredRecipes = useMemo(() => {
    let list = selectedCategory === '全部' ? RECIPES : RECIPES.filter(r => r.category === selectedCategory);
    
    if (isSearchOpen && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(r => 
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.ingredients.some(ing => ing.name.toLowerCase().includes(q))
      );
    }
    return list;
  }, [selectedCategory, searchQuery, isSearchOpen]);

  const favoriteRecipes = useMemo(() => {
    let list = RECIPES.filter(r => favorites.includes(r.id));
    if (isSearchOpen && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(r => 
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.ingredients.some(ing => ing.name.toLowerCase().includes(q))
      );
    }
    return list;
  }, [favorites, searchQuery, isSearchOpen]);

  useLayoutEffect(() => {
    if (isSearchOpen && searchQuery) {
      const timer = requestAnimationFrame(() => highlightText(searchQuery));
      return () => cancelAnimationFrame(timer);
    } else {
      clearHighlights();
    }
  }, [searchQuery, filteredRecipes, isSearchOpen, highlightText, clearHighlights, activeTab]);

  const handleOpenSearch = () => {
    if (scrollContainerRef.current) {
      scrollMemoryRef.current = scrollContainerRef.current.scrollTop;
    }
    setIsSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 300);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    clearHighlights();
    
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ 
          top: scrollMemoryRef.current, 
          behavior: 'smooth' 
        });
      }
    });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isSearchOpen && !searchQuery && searchInputRef.current && !searchInputRef.current.contains(e.target as Node)) {
        handleCloseSearch();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen, searchQuery]);

  const handleToggle = (id: string) => {
    const newState = { ...checkedIngredients, [id]: !checkedIngredients[id] };
    setCheckedIngredients(newState);
    localStorage.setItem('kitchen_checked_v8', JSON.stringify(newState));
  };

  const handleToggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id) ? favorites.filter(fav => fav !== id) : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem('kitchen_favorites_v11', JSON.stringify(newFavorites));
  };

  const handleClearFavorites = () => {
    setFavorites([]);
    localStorage.setItem('kitchen_favorites_v11', JSON.stringify([]));
  };

  const handleResetIngredients = (ids: string[]) => {
    const newState = { ...checkedIngredients };
    ids.forEach(id => { delete newState[id]; });
    setCheckedIngredients(newState);
    localStorage.setItem('kitchen_checked_v8', JSON.stringify(newState));
  };

  const handleTouchStart = (e: React.TouchEvent) => { touchStartRef.current = e.touches[0].clientX; };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null || activeTab !== 'recipes' || isSearchOpen) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;
    const currentIndex = CATEGORIES.indexOf(selectedCategory);
    
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < CATEGORIES.length - 1) { 
        setSlideDirection('right'); 
        setSelectedCategory(CATEGORIES[currentIndex + 1]); 
      }
      else if (diff < 0 && currentIndex > 0) { 
        setSlideDirection('left'); 
        setSelectedCategory(CATEGORIES[currentIndex - 1]); 
      }
    }
    touchStartRef.current = null;
  };

  if (!isAuth) return <LoginView onLogin={() => { setIsAuth(true); sessionStorage.setItem('kitchen_auth', 'true'); }} />;

  return (
    <div className="h-[100dvh] bg-[#1A1A1A] font-sans max-w-md mx-auto relative flex flex-col shadow-2xl overflow-hidden">
      <div className="flex-1 bg-[#FDFBF7] relative flex flex-col h-full overflow-hidden">
        
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[900] w-[calc(100%-2rem)] max-w-[360px] transition-all duration-500 transform ${isSearchOpen ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-20 opacity-0 scale-95 pointer-events-none'}`}>
          <div className="relative group">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-full border border-white/50 shadow-mystic pointer-events-none" />
            <div className="relative flex items-center px-6 py-4 gap-3">
              <span className="text-[#5C5C78]"><SearchIcon /></span>
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search everything..." 
                className="flex-1 bg-transparent border-none outline-none text-[14px] font-bold text-gray-900 placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" onClick={handleCloseSearch} className="text-gray-400 hover:text-gray-900 transition-colors">
                <CloseIcon />
              </button>
            </div>
          </div>
        </div>

        <div className="fixed bottom-28 right-6 z-[800]">
          <button 
            onClick={isSearchOpen ? handleCloseSearch : handleOpenSearch}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 active:scale-90 shadow-glass border-4 backdrop-blur-[1px] ${isSearchOpen ? 'bg-[#5C5C78] text-white border-[#5C5C78]/20 rotate-90 shadow-mystic' : 'bg-white/25 text-[#5C5C78] border-white/40'}`}
          >
            {isSearchOpen ? <CloseIcon /> : <SearchIcon />}
          </button>
        </div>

        <div className="flex-shrink-0 z-[100] bg-[#FDFBF7]/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
          <header className="px-8 pt-10 pb-4">
            <div className="flex justify-between items-end mb-8">
              <h1 className="text-[36px] font-serif font-bold text-gray-900 leading-none">Kitchen Vault</h1>
              <div className="w-12 h-12 rounded-[14px] bg-white p-1 shadow-mystic border border-gray-50 flex items-center justify-center">
                <img src="isa_icon.svg" className="w-full h-full object-contain rounded-[10px]" alt="Vault Icon" />
              </div>
            </div>
            
            {activeTab === 'recipes' ? (
              <div ref={navRef} className="relative flex items-center h-10 overflow-x-auto hide-scrollbar gap-2.5 scroll-smooth">
                {/* 焦點指示器：優化定位策略，使用絕對高度 h-9 並由 translate-y 控制居中 */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 h-9 bg-[#5C5C78] rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-0" 
                  style={{ left: categoryIndicatorStyle.left, width: categoryIndicatorStyle.width }} 
                />
                {CATEGORIES.map((cat, idx) => (
                  <button 
                    key={cat} 
                    ref={el => { categoryRefs.current[cat] = el; }} 
                    onClick={() => { const oldIdx = CATEGORIES.indexOf(selectedCategory); setSlideDirection(idx > oldIdx ? 'right' : 'left'); setSelectedCategory(cat); }} 
                    className={`group relative z-10 px-5 h-10 rounded-full flex items-center justify-center gap-2 text-[11px] font-bold tracking-tight transition-all duration-500 whitespace-nowrap ${selectedCategory === cat && categoryIndicatorStyle.width > 0 ? 'text-white' : 'bg-white/40 text-gray-400 hover:bg-gray-100/80 backdrop-blur-sm'}`}
                  >
                    <div className={`w-5 h-5 flex items-center justify-center transition-all duration-500 ${selectedCategory === cat ? 'scale-110' : 'scale-95 opacity-80'}`}>
                      {getCategoryMiniIcon(cat)}
                    </div>
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="pb-3 px-1">
                <div className="flex items-center justify-between p-2 bg-white/60 backdrop-blur-xl border border-white/80 rounded-[20px] shadow-glass">
                  <div className="flex items-center gap-3 pl-3">
                    <div className="p-1.5 bg-[#5C5C78]/10 rounded-lg text-[#5C5C78]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 leading-none mb-1">Selection</span>
                      <span className="text-[13px] font-black text-[#5C5C78] line-height-none">{favorites.length} <span className="text-[10px] opacity-40">ITEMS</span></span>
                    </div>
                  </div>
                  
                  {favorites.length > 0 && (
                    <button 
                      onClick={handleClearFavorites} 
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#5C5C78] rounded-[14px] text-[10px] font-black uppercase tracking-widest text-white active:scale-95 transition-all shadow-lg shadow-[#5C5C78]/20 group"
                    >
                      <span className="group-active:rotate-180 transition-transform duration-500"><ResetIcon /></span>
                      Reset
                    </button>
                  )}
                </div>
              </div>
            )}
          </header>
        </div>
        
        <div 
          ref={scrollContainerRef}
          id="recipes-container"
          className="flex-1 overflow-y-auto hide-scrollbar pt-6 pb-44"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {(activeTab === 'recipes' ? filteredRecipes : favoriteRecipes).length > 0 ? (
            <main className="px-8 min-h-full select-none">
              <div key={selectedCategory + (isSearchOpen ? '_search' : '')} className={`grid grid-cols-2 gap-x-4 gap-y-12 animate-in duration-700 ease-[cubic-bezier(0.2,1,0.2,1)] fill-mode-both ${slideDirection === 'right' ? 'slide-in-from-right-20 fade-in' : 'slide-in-from-left-20 fade-in'}`}>
                {(activeTab === 'recipes' ? filteredRecipes : favoriteRecipes).map((recipe) => {
                  const isFavorite = favorites.includes(recipe.id);
                  const q = searchQuery.toLowerCase().trim();
                  const isDescriptionMatch = q && recipe.description.toLowerCase().includes(q);
                  const isIngredientMatch = q && recipe.ingredients.some(i => i.name.toLowerCase().includes(q));

                  return (
                    <div key={recipe.id} onClick={() => setSelectedIndex(RECIPES.indexOf(recipe))} className="group relative bg-white rounded-[32px] p-4 flex flex-col shadow-sm border border-gray-100 active:scale-[0.96] transition-all hover:shadow-mystic cursor-pointer overflow-visible">
                      <button onClick={(e) => { e.stopPropagation(); handleToggleFavorite(recipe.id); }} className="absolute -top-3 -left-3 z-[120]">
                        <CollectionIcon active={isFavorite} className="w-12 h-12" />
                      </button>
                      <div className={`w-full aspect-square rounded-[24px] overflow-visible shadow-sm mb-4 flex items-center justify-center relative transition-all duration-700 group-hover:shadow-md bg-gray-50/50`}>
                        <div className="transition-transform duration-700 group-hover:scale-110 flex items-center justify-center">
                          {getRecipeIcon(recipe.name, recipe.category)}
                        </div>
                        <StickerTag label={recipe.category} color={getRecipeColor(recipe.category)} className="top-2 -right-4" />
                      </div>
                      <h4 className="text-[15px] font-serif font-bold text-gray-900 px-1 leading-tight line-clamp-2 mb-1">{recipe.name}</h4>
                      
                      {isSearchOpen && q && (
                        <div className="mt-2 space-y-1 border-t border-gray-50 pt-2">
                          {isDescriptionMatch && (
                            <p className="text-[10px] text-gray-400 line-clamp-2 leading-normal">
                              {recipe.description}
                            </p>
                          )}
                          {isIngredientMatch && (
                            <p className="text-[9px] text-[#5C5C78] font-bold uppercase tracking-wider">
                              {recipe.ingredients.filter(i => i.name.toLowerCase().includes(q)).map(i => i.name).join(', ')}
                            </p>
                          )}
                        </div>
                      )}
                      
                      <span className="mt-1 text-[12px] font-bold text-gray-400 px-1">{recipe.date}</span>
                    </div>
                  );
                })}
              </div>
            </main>
          ) : (
            <div className="px-8 min-h-full">
              <div className="pt-2 flex flex-col items-center text-center h-full">
                <div className="space-y-4 mb-10">
                  <h3 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
                    {isSearchOpen ? 'No Matches Found' : 'The Black Book is Empty'}
                  </h3>
                  <p className="text-sm text-gray-400 max-w-[240px] mx-auto leading-relaxed">
                    {isSearchOpen ? 'Try searching for specific ingredients or categories.' : 'Your curated collection will appear here.'}
                  </p>
                </div>
                <div className="mb-8 relative">
                  <img 
                    src="chef_blue.svg" 
                    className="w-[11.25rem] h-[11.25rem] object-contain animate-pulse duration-[5000ms]" 
                    alt="Chef Icon" 
                  />
                </div>
                {!isSearchOpen && (
                  <button onClick={() => { setActiveTab('recipes'); setSelectedCategory('全部'); }} className="bg-gray-900 text-white px-10 py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase shadow-2xl active:scale-95 transition-all hover:bg-[#5C5C78]">Begin Curating</button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-2xl border border-white/60 p-1 rounded-full shadow-mystic z-[150] w-[calc(100%-4rem)] max-w-[320px]">
        <div className="relative flex items-center h-14">
          <div className="absolute top-1/2 -translate-y-1/2 w-14 h-14 bg-gray-100/90 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0" style={{ left: activeTab === 'recipes' ? '25%' : '75%', transform: 'translate(-50%, -50%)' }} />
          <button onClick={() => setActiveTab('recipes')} className="flex-1 h-full flex flex-col items-center justify-center relative z-10 outline-none">
            <RecipeIcon active={activeTab === 'recipes'} />
            <span className={`text-[9px] font-black uppercase mt-1 tracking-tighter transition-colors duration-300 ${activeTab === 'recipes' ? 'text-[#5C5C78]' : 'text-gray-400'}`}>Recipes</span>
          </button>
          <button onClick={() => setActiveTab('menu')} className="flex-1 h-full flex flex-col items-center justify-center relative z-10 outline-none">
            <MenuIcon active={activeTab === 'menu'} />
            <span className={`text-[9px] font-black uppercase mt-1 tracking-tighter transition-colors duration-300 ${activeTab === 'menu' ? 'text-[#5C5C78]' : 'text-gray-400'}`}>Menu</span>
          </button>
        </div>
      </nav>

      {selectedIndex !== null && (
        <RecipeDetail 
          selectedIndex={selectedIndex} 
          onClose={() => setSelectedIndex(null)} 
          checkedIngredients={checkedIngredients} 
          onToggleIngredient={handleToggle} 
          onResetIngredients={handleResetIngredients} 
          recipes={RECIPES}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </div>
  );
}
