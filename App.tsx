
import { Recipe } from './types';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { RECIPES } from './constants';

const CORRECT_PASSWORD = '333';
const PRIMARY_COLOR = '#5C5C78';

// --- UI Framework Icons ---
const BackIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>;

const RecipeIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? PRIMARY_COLOR : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    {active && <line x1="8" y1="6" x2="16" y2="6" strokeWidth="1.5" />}
    {active && <line x1="8" y1="10" x2="16" y2="10" strokeWidth="1.5" />}
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

const SearchIcon = ({ className = "" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// --- Bookmark Collection Icon ---
const CollectionIcon = ({ active, className = "" }: { active: boolean, className?: string }) => (
  <div className={`relative flex items-center justify-center transition-transform duration-200 ${active ? 'scale-110' : 'scale-100'} ${className}`}>
    <img 
      src={active ? "Bookmark_on.svg" : "Bookmark_off.svg"} 
      className="w-full h-full object-contain opacity-100"
      style={{ opacity: 1 }}
      alt="Bookmark"
    />
  </div>
);

// --- Highlighting Component ---
const HighlightText: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
  if (!highlight.trim()) return <>{text}</>;
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <span key={i} className="bg-[#FFD154] text-gray-900 rounded-sm px-0.5 font-bold shadow-[0_0_8px_rgba(255,209,84,0.4)]">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

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
  searchQuery: string;
}> = ({ selectedIndex, onClose, checkedIngredients, onToggleIngredient, onResetIngredients, recipes, favorites, onToggleFavorite, searchQuery }) => {
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
    const animationId = requestAnimationFrame(() => { requestAnimationFrame(performScroll); });
    return () => cancelAnimationFrame(animationId);
  }, [selectedIndex]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const verticalScrollables = scrollContainerRef.current.querySelectorAll('.overflow-y-auto');
      verticalScrollables.forEach(el => {
        el.scrollTop = 0;
      });
    }
  }, [currentCardIndex]);

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
                <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col pb-44">
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
                          <HighlightText text={recipe.name} highlight={searchQuery} />
                        </h1>
                        <button 
                          onClick={() => onToggleFavorite(recipe.id)}
                          className="mt-1 p-1 active:scale-90 transition-all bg-gray-50 rounded-2xl border border-white shadow-sm overflow-hidden"
                        >
                          <CollectionIcon active={isFavorite} className="w-10 h-10" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5C5C78]">Recipe Date</span>
                        <span className="text-[12px] font-bold text-gray-400">{recipe.date}</span>
                      </div>

                      <p className="text-gray-500 text-[13px] leading-relaxed mb-8 border-l-2 border-gray-100 pl-4 whitespace-pre-wrap">{recipe.description}</p>
                      
                      <div className="relative flex gap-1 p-1 bg-gray-50/80 rounded-2xl mb-8">
                        <div className="absolute h-[calc(100%-8px)] w-[calc(50%-4px)] bg-white shadow-sm rounded-xl transition-all duration-300 z-0" style={{ transform: `translateX(${activeTab === 'ingredients' ? '0' : '100%'})` }} />
                        <button onClick={() => setActiveTab('ingredients')} className={`relative z-10 flex-1 py-3.5 font-bold text-[10px] tracking-widest transition-colors duration-300 ${activeTab === 'ingredients' ? 'text-gray-900' : 'text-gray-400'}`}>ITEMS ({recipe.ingredients.length})</button>
                        <button onClick={() => setActiveTab('steps')} className={`relative z-10 flex-1 py-3.5 font-bold text-[10px] tracking-widest transition-colors duration-300 ${activeTab === 'steps' ? 'text-gray-900' : 'text-gray-400'}`}>STEPS ({recipe.steps.length})</button>
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
                                      <HighlightText text={ing.name} highlight={searchQuery} />
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
                                  
                                  <p className="text-[#4A4A4A] text-[13px] font-semibold leading-[1.8] tracking-tight whitespace-pre-wrap relative z-10">
                                    {recipe.tips}
                                  </p>
                                  
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
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

  // Reset scroll on search
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [searchQuery, selectedCategory, activeTab]);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 300);
    }
  }, [isSearchOpen]);

  // Update category indicator position
  useEffect(() => {
    const activeBtn = categoryRefs.current[selectedCategory];
    if (activeBtn && activeTab === 'recipes') {
      setCategoryIndicatorStyle({
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth
      });
      
      if (navRef.current) {
        const containerWidth = navRef.current.offsetWidth;
        const btnOffset = activeBtn.offsetLeft;
        const btnWidth = activeBtn.offsetWidth;
        navRef.current.scrollTo({ left: btnOffset - (containerWidth / 2) + (btnWidth / 2), behavior: 'smooth' });
      }
    }
  }, [selectedCategory, activeTab]);

  const handleToggle = (id: string) => {
    const newState = { ...checkedIngredients, [id]: !checkedIngredients[id] };
    setCheckedIngredients(newState);
    localStorage.setItem('kitchen_checked_v8', JSON.stringify(newState));
  };

  const handleToggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id) 
      ? favorites.filter(fav => fav !== id) 
      : [...favorites, id];
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

  // Advanced searching logic
  const performFilter = (list: Recipe[]) => {
    let result = list;
    if (selectedCategory !== '全部' && activeTab === 'recipes' && !searchQuery.trim()) {
      result = result.filter(r => r.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.name.toLowerCase().includes(q) || 
        r.category.toLowerCase().includes(q) ||
        r.ingredients.some(i => i.name.toLowerCase().includes(q))
      );
    }
    return result;
  };

  const filteredRecipes = useMemo(() => performFilter(RECIPES), [selectedCategory, searchQuery, activeTab]);
  const favoriteRecipes = useMemo(() => performFilter(RECIPES.filter(r => favorites.includes(r.id))), [favorites, searchQuery, activeTab]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartRef.current = e.touches[0].clientX; };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null || activeTab !== 'recipes' || isSearchOpen) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;
    const currentIndex = CATEGORIES.indexOf(selectedCategory);
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < CATEGORIES.length - 1) { setSlideDirection('right'); setSelectedCategory(CATEGORIES[currentIndex + 1]); }
      else if (diff < 0 && currentIndex > 0) { setSlideDirection('left'); setSelectedCategory(CATEGORIES[currentIndex - 1]); }
    }
    touchStartRef.current = null;
  };

  const closeSearch = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const closeSearchIfEmpty = () => {
    if (!searchQuery.trim()) {
      closeSearch();
    }
  };

  if (!isAuth) return <LoginView onLogin={() => { setIsAuth(true); sessionStorage.setItem('kitchen_auth', 'true'); }} />;

  return (
    <div className="h-[100dvh] bg-[#1A1A1A] font-sans max-w-md mx-auto relative flex flex-col shadow-2xl overflow-hidden">
      <div className="flex-1 bg-[#FDFBF7] relative flex flex-col h-full overflow-hidden">
        {/* Search Overlay Input - Higher index to cover header but under FAB */}
        <div className={`absolute top-0 inset-x-0 z-[650] transition-all duration-500 ease-[cubic-bezier(0.2,1,0.2,1)] ${isSearchOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
          <div className="bg-white/60 backdrop-blur-2xl border-b border-gray-100 px-8 pt-12 pb-6 shadow-mystic">
            <div className="relative flex items-center gap-3">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder="Search recipes, ingredients..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-[#5C5C78]/20 transition-all placeholder:text-gray-300"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                    <CloseIcon />
                  </button>
                )}
              </div>
              <button 
                onClick={closeSearch}
                className="text-[10px] font-black uppercase tracking-widest text-[#5C5C78] px-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Header Section */}
        <div className="flex-shrink-0 z-[100] bg-[#FDFBF7]/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
          <header className="px-8 pt-10 pb-4">
            <div className="flex justify-between items-end mb-8">
              <h1 className="text-[36px] font-serif font-bold text-gray-900 leading-none">Kitchen Vault</h1>
              <div className="w-12 h-12 rounded-[14px] bg-white p-1 shadow-mystic border border-gray-50 flex items-center justify-center">
                <img src="isa_icon.svg" className="w-full h-full object-contain rounded-[10px]" alt="Vault Icon" />
              </div>
            </div>
            
            {activeTab === 'recipes' ? (
              <div ref={navRef} className="relative flex overflow-x-auto hide-scrollbar gap-2.5 pb-2 scroll-smooth">
                <div 
                  className="absolute top-0 h-9 bg-[#5C5C78] rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-0 shadow-md"
                  style={{ 
                    left: categoryIndicatorStyle.left, 
                    width: categoryIndicatorStyle.width 
                  }}
                />
                
                {CATEGORIES.map((cat, idx) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button 
                      key={cat} 
                      ref={el => categoryRefs.current[cat] = el}
                      onClick={() => { 
                        const oldIdx = CATEGORIES.indexOf(selectedCategory); 
                        setSlideDirection(idx > oldIdx ? 'right' : 'left'); 
                        setSelectedCategory(cat); 
                        if (searchQuery) setSearchQuery(''); // Clear search when category changes
                      }} 
                      className={`relative z-10 px-5 py-2.5 rounded-full text-[11px] font-bold tracking-tight transition-colors duration-300 whitespace-nowrap ${isActive && !searchQuery ? 'text-white' : 'bg-gray-100/50 text-gray-400 hover:bg-gray-200/60'}`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="pb-2 flex justify-between items-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5C5C78]">Private Selection ({favorites.length})</p>
                {favorites.length > 0 && (
                  <button 
                    onClick={handleClearFavorites}
                    className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-[#5C5C78] active:scale-90 transition-all shadow-sm"
                  >
                    <ResetIcon />
                    Reset
                  </button>
                )}
              </div>
            )}
          </header>
        </div>
        
        {/* Main Content Scrollable Area */}
        <div 
          ref={scrollContainerRef}
          onClick={closeSearchIfEmpty}
          className="flex-1 overflow-y-auto hide-scrollbar pt-6 pb-44"
        >
          {activeTab === 'recipes' ? (
            <main className="px-8 min-h-full select-none" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
              <div key={selectedCategory + searchQuery} className={`grid grid-cols-2 gap-x-4 gap-y-12 animate-in duration-500 ease-out fill-mode-both ${slideDirection === 'right' ? 'slide-in-from-right-8 fade-in' : 'slide-in-from-left-8 fade-in'}`}>
                {filteredRecipes.length > 0 ? (
                  filteredRecipes.map((recipe, index) => {
                    const recipeColor = getRecipeColor(recipe.category);
                    const isFavorite = favorites.includes(recipe.id);
                    // Find matched ingredients if searching
                    const matchedIngredient = searchQuery.trim() ? recipe.ingredients.find(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())) : null;

                    return (
                      <div key={recipe.id} onClick={() => setSelectedIndex(RECIPES.indexOf(recipe))} className="group relative bg-white rounded-[32px] p-4 flex flex-col shadow-sm border border-gray-100 active:scale-[0.97] transition-all hover:shadow-mystic cursor-pointer overflow-visible">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleToggleFavorite(recipe.id); }}
                          className="absolute top-0 left-6 z-[120]"
                        >
                          <CollectionIcon active={isFavorite} className="w-8 h-8" />
                        </button>

                        <div className={`w-full aspect-square rounded-[24px] overflow-visible shadow-sm mb-4 flex items-center justify-center relative transition-all duration-500 group-hover:shadow-md bg-gray-50/50`}>
                          <div className="transition-transform duration-700 group-hover:scale-110 flex items-center justify-center">
                            {getRecipeIcon(recipe.name, recipe.category)}
                          </div>
                          <StickerTag label={recipe.category} color={recipeColor} className="top-2 -right-4" />
                        </div>
                        <h4 className="text-[15px] font-serif font-bold text-gray-900 px-1 leading-tight line-clamp-2 mb-1">
                          <HighlightText text={recipe.name} highlight={searchQuery} />
                        </h4>
                        
                        {/* Expanded Matched Content */}
                        {matchedIngredient && (
                          <div className="mt-1 px-1 py-1 rounded bg-[#FFD154]/10 border border-[#FFD154]/30 animate-in fade-in zoom-in duration-300">
                             <p className="text-[9px] font-black text-[#5C5C78] uppercase tracking-tighter opacity-70">Matches:</p>
                             <p className="text-[10px] font-bold text-gray-700 leading-tight">
                               <HighlightText text={matchedIngredient.name} highlight={searchQuery} />
                             </p>
                          </div>
                        )}

                        <span className="mt-1 text-[12px] font-bold text-gray-400 px-1">{recipe.date}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-2 py-20 text-center">
                    <p className="text-gray-400 font-serif italic mb-2">No matching secrets found.</p>
                    <button 
                      onClick={() => { setSelectedCategory('全部'); setSearchQuery(''); }} 
                      className="text-[10px] font-black uppercase tracking-widest text-[#5C5C78] underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </main>
          ) : (
            <div className="px-8 min-h-full">
              {favoriteRecipes.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-12 animate-in slide-in-from-bottom-8 fade-in duration-700">
                  {favoriteRecipes.map((recipe, index) => {
                    const recipeColor = getRecipeColor(recipe.category);
                    const matchedIngredient = searchQuery.trim() ? recipe.ingredients.find(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())) : null;
                    return (
                      <div key={recipe.id} onClick={() => setSelectedIndex(RECIPES.indexOf(recipe))} className="group relative bg-white rounded-[32px] p-4 flex flex-col shadow-sm border border-gray-100 active:scale-[0.97] transition-all hover:shadow-mystic cursor-pointer overflow-visible">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleToggleFavorite(recipe.id); }}
                          className="absolute top-0 left-6 z-[120]"
                        >
                          <CollectionIcon active={true} className="w-8 h-8" />
                        </button>

                        <div className={`w-full aspect-square rounded-[24px] overflow-visible shadow-sm mb-4 flex items-center justify-center relative transition-all duration-500 group-hover:shadow-md bg-gray-50/50`}>
                          <div className="transition-transform duration-700 group-hover:scale-110 flex items-center justify-center">
                            {getRecipeIcon(recipe.name, recipe.category)}
                          </div>
                          <StickerTag label={recipe.category} color={recipeColor} className="top-2 -right-4" />
                        </div>
                        <h4 className="text-[15px] font-serif font-bold text-gray-900 px-1 leading-tight line-clamp-2 mb-1">
                          <HighlightText text={recipe.name} highlight={searchQuery} />
                        </h4>
                        
                        {matchedIngredient && (
                          <div className="mt-1 px-1 py-1 rounded bg-[#FFD154]/10 border border-[#FFD154]/30">
                             <p className="text-[9px] font-black text-[#5C5C78] uppercase tracking-tighter opacity-70">Matches:</p>
                             <p className="text-[10px] font-bold text-gray-700 leading-tight">
                               <HighlightText text={matchedIngredient.name} highlight={searchQuery} />
                             </p>
                          </div>
                        )}

                        <span className="mt-1 text-[12px] font-bold text-gray-400 px-1">{recipe.date}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="pt-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                  <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">The Menu</h1>
                  <p className="text-sm text-gray-400 mb-12">Curate your personal selection of secrets.</p>
                  <div className="bg-white rounded-[40px] p-12 border border-dashed border-gray-200 flex flex-col items-center space-y-6">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center shadow-inner">
                      <img src="chef_blue.svg" className="w-14 h-14 object-contain" alt="Chef Icon" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-gray-300 uppercase tracking-tighter">Vault is Empty</h3>
                    <button 
                      onClick={() => { setActiveTab('recipes'); setSelectedCategory('全部'); }} 
                      className="bg-gray-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-xl active:scale-95 transition-all"
                    >
                      Go Selecting
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Search Button - Increased z-index to stay above details and search overlay if needed */}
      <button 
        onClick={() => setIsSearchOpen(!isSearchOpen)}
        className={`fixed bottom-28 right-8 z-[700] w-14 h-14 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-mystic active:scale-90 transition-all duration-300 ${isSearchOpen ? 'rotate-90 bg-[#5C5C78]' : ''}`}
      >
        {isSearchOpen ? <CloseIcon /> : <SearchIcon />}
      </button>

      {/* Bottom Main Nav */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-2xl border border-white/60 p-1 rounded-full shadow-mystic z-[150] w-[calc(100%-4rem)] max-w-[320px]">
        <div className="relative flex items-center h-14">
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-14 h-14 bg-gray-100/90 rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-0" 
            style={{ 
              left: activeTab === 'recipes' ? '25%' : '75%',
              transform: 'translate(-50%, -50%)'
            }} 
          />
          <button onClick={() => { setActiveTab('recipes'); if(isSearchOpen) closeSearch(); }} className="flex-1 h-full flex flex-col items-center justify-center relative z-10 outline-none">
            <div className="flex flex-col items-center">
              <RecipeIcon active={activeTab === 'recipes'} />
              <span className={`text-[9px] font-black uppercase mt-1 tracking-tighter ${activeTab === 'recipes' ? 'text-[#5C5C78]' : 'text-gray-400'}`}>Recipes</span>
            </div>
          </button>
          <button onClick={() => { setActiveTab('menu'); if(isSearchOpen) closeSearch(); }} className="flex-1 h-full flex flex-col items-center justify-center relative z-10 outline-none">
            <div className="flex flex-col items-center">
              <MenuIcon active={activeTab === 'menu'} />
              <span className={`text-[9px] font-black uppercase mt-1 tracking-tighter ${activeTab === 'menu' ? 'text-[#5C5C78]' : 'text-gray-400'}`}>Menu</span>
            </div>
          </button>
        </div>
      </nav>

      {/* Detail View Overlay */}
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
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
}
