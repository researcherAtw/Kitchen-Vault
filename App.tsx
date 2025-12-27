
import { Recipe } from './types';
import React, { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect, useDeferredValue } from 'react';
import { RECIPES } from './constants';

const CORRECT_PASSWORD = '333';
const PRIMARY_COLOR = '#5C5C78';

// --- Optimized Icon Mask with fixed rendering properties ---
const IconMask = React.memo(({ src, className = "w-4 h-4" }: { src: string, className?: string }) => (
  <div 
    className={`${className} flex-shrink-0 transform-gpu transition-all duration-200`}
    style={{
      maskImage: `url("${src}")`,
      WebkitMaskImage: `url("${src}")`,
      maskRepeat: 'no-repeat',
      maskPosition: 'center',
      maskSize: 'contain',
      backgroundColor: 'currentColor'
    }}
  />
));

// --- Optimized UI Components ---
const BackIcon = React.memo(() => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>);

const RecipeIcon = React.memo(({ active }: { active: boolean }) => (
  <IconMask src="recipe_book.svg" className={`w-7 h-7 ${active ? 'text-[#5C5C78]' : 'text-gray-400/60'}`} />
));

const MenuIcon = React.memo(({ active }: { active: boolean }) => (
  <IconMask src="spoon_and_fork.svg" className={`w-7 h-7 ${active ? 'text-[#5C5C78]' : 'text-gray-400/60'}`} />
));

const SearchIcon = React.memo(() => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
));

const CloseIcon = React.memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
));

const ResetIcon = React.memo(() => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 4v6h-6" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
));

const YouTubeIcon = React.memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 12 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
));

const SecretStarIcon = React.memo(() => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#5C5C78]">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
));

const BasketIcon = React.memo(({ active }: { active: boolean }) => (
  <IconMask src="items.svg" className={`w-5 h-5 transition-opacity ${active ? 'opacity-100 text-slate-900' : 'opacity-40 text-slate-400'}`} />
));

const ChefHatIcon = React.memo(({ active }: { active: boolean }) => (
  <IconMask src="setps.svg" className={`w-5 h-5 transition-opacity ${active ? 'opacity-100 text-slate-900' : 'opacity-40 text-slate-400'}`} />
));

const StepIcon = React.memo(() => (
  <IconMask src="setps.svg" className="w-3.5 h-3.5 opacity-60" />
));

const CollectionIcon = React.memo(({ active, className = "" }: { active: boolean, className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <img 
      src={active ? "Bookmark_on.svg" : "Bookmark_off.svg"} 
      className="w-full h-full object-contain"
      alt="Bookmark"
    />
  </div>
));

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
    case '肉類料理': return <img src="meat_2.svg" className={finalClass} alt="Meat" />;
    case '海鮮料理': return <img src="seafood.svg" className={finalClass} alt="Seafood" />;
    case '蔬食料理': return <img src="vegetable.svg" className={finalClass} alt="Vegetable" />;
    case '湯品鍋物': return <img src="soup.svg" className={finalClass} alt="Soup" />;
    case '蛋類料理': return <img src="egg.svg" className={finalClass} alt="Egg" />;
    default: return <img src="soup.svg" className={finalClass} alt="Default" />;
  }
};

const getCategoryMiniIcon = (category: string) => {
  const srcMap: Record<string, string> = {
    '全部': 'all.svg',
    '肉類料理': 'chicken.svg',
    '海鮮料理': 'fish.svg',
    '蔬食料理': 'broccoli.svg',
    '湯品鍋物': 'pot.svg',
    '蛋類料理': 'eggegg.svg',
    '豆腐料理': 'tofutofu.svg',
    '麵類料理': 'noodles.svg',
    '飯類料理': 'ricerice.svg',
    '中式甜點': 'mooncake.svg',
    '西式甜點': 'cakecake.svg',
    '自製醬餡': 'jamjam.svg',
    '飲品': 'cocktail.svg'
  };
  const src = srcMap[category] || 'all.svg';
  return <IconMask src={src} className="w-5 h-5" />;
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

// --- Memoized Content Section to Fix Flickering ---
const TabContent = React.memo(({ 
  activeTab, 
  recipe, 
  checkedIngredients, 
  onToggleIngredient, 
  onResetIngredients 
}: { 
  activeTab: 'ingredients' | 'steps', 
  recipe: Recipe, 
  checkedIngredients: Record<string, boolean>,
  onToggleIngredient: (id: string) => void,
  onResetIngredients: (ids: string[]) => void
}) => {
  const recipeIngIds = useMemo(() => recipe.ingredients.map(i => i.id), [recipe.ingredients]);
  const hasCheckedIngredients = useMemo(() => recipeIngIds.some(id => checkedIngredients[id]), [recipeIngIds, checkedIngredients]);

  return (
    <div className="space-y-4 min-h-[360px] transform-gpu overflow-hidden">
      {activeTab === 'ingredients' ? (
        <div key="ing-content" className="animate-in fade-in duration-300">
          <div className={`flex justify-end transition-all duration-500 ease-out overflow-hidden ${hasCheckedIngredients ? 'max-h-12 opacity-100 mb-2' : 'max-h-0 opacity-0'}`}>
            <button onClick={(e) => { e.stopPropagation(); onResetIngredients(recipeIngIds); }} className="flex items-center gap-2 px-4 py-2 bg-[#5C5C78]/5 hover:bg-[#5C5C78]/10 rounded-xl text-[9px] font-black uppercase tracking-[0.25em] text-[#5C5C78] active:scale-95 transition-all group">
              <span className="group-hover:rotate-[-45deg] transition-transform duration-300"><ResetIcon /></span>
              Reset List
            </button>
          </div>
          <div className="space-y-3">
            {recipe.ingredients.map((ing) => {
              const isChecked = checkedIngredients[ing.id];
              return (
                <div key={ing.id} onClick={() => onToggleIngredient(ing.id)} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/60 border border-transparent active:border-gray-200 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isChecked ? 'bg-[#5C5C78] border-[#5C5C78]' : 'border-gray-200'}`}>{isChecked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>}</div>
                    <span className={`text-sm font-semibold ${isChecked ? 'text-gray-300 line-through' : 'text-gray-800'}`}>{ing.name}</span>
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{ing.amount}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div key="step-content" className="space-y-6 pt-4 animate-in fade-in duration-300">
          {recipe.youtubeUrl && (
            <a href={recipe.youtubeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-2.5 mb-4 bg-[#FF0000]/5 border border-[#FF0000]/10 rounded-xl text-[#FF0000] active:scale-[0.98] transition-all">
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
              <div className="bg-gradient-to-br from-[#F9F7F2] to-[#FDFBF7] rounded-3xl p-8 pt-12 relative overflow-hidden group shadow-[0_10px_40_rgba(0,0,0,0.03)]">
                <div className="absolute -bottom-10 -right-10 opacity-[0.05] grayscale scale-[2.5] rotate-[-15deg] pointer-events-none transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-[-20deg]">
                  {getRecipeIcon(recipe.name, recipe.category, "w-32 h-32 object-contain")}
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#5C5C78]/5 rounded-full -mr-12 -mt-12 transition-transform duration-700 group-hover:scale-110" />
                <p className="text-[#4A4A4A] text-[13px] font-semibold leading-[1.8] tracking-tight whitespace-pre-wrap relative z-10">
                  {recipe.tips.split(/(\*\*.*?\*\*)/g).map((part, i) => part.startsWith('**') && part.endsWith('**') ? <strong key={i} className="font-black text-gray-900">{part.slice(2, -2)}</strong> : part)}
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
  );
});

// --- Sub-Components ---
const StickerTag = React.memo(({ label, color, className }: { label: string, color: string, className?: string }) => (
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
));

const RecipeDetail: React.FC<{ 
  selectedIndex: number;
  onClose: () => void;
  checkedIngredients: Record<string, boolean>;
  onToggleIngredient: (id: string) => void;
  onResetIngredients: (ids: string[]) => void;
  recipes: Recipe[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  searchQuery?: string;
  onRefreshHighlight?: () => void;
}> = ({ selectedIndex, onClose, checkedIngredients, onToggleIngredient, onResetIngredients, recipes, favorites, onToggleFavorite, searchQuery, onRefreshHighlight }) => {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps'>('ingredients');
  const [currentCardIndex, setCurrentCardIndex] = useState(selectedIndex);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onRefreshHighlight) onRefreshHighlight();
  }, [activeTab, currentCardIndex, onRefreshHighlight]);

  useEffect(() => {
    const recipe = recipes[currentCardIndex];
    if (searchQuery && recipe) {
      const q = searchQuery.toLowerCase().trim();
      const inIngredients = recipe.ingredients.some(i => i.name.toLowerCase().includes(q));
      const inSteps = recipe.steps.some(s => s.toLowerCase().includes(q)) || (recipe.tips && recipe.tips.toLowerCase().includes(q));
      if (!inIngredients && inSteps) setActiveTab('steps');
    }
  }, [searchQuery, currentCardIndex, recipes]);

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

  const handleHorizontalScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = container.clientWidth;
    if (cardWidth === 0) return;
    const newIndex = Math.round(container.scrollLeft / cardWidth);
    if (newIndex !== currentCardIndex && newIndex >= 0 && newIndex < recipes.length) {
      setCurrentCardIndex(newIndex);
    }
  }, [currentCardIndex, recipes.length]);

  return (
    <div className="fixed inset-0 z-[600] bg-[#FDFBF7] overflow-hidden font-sans max-w-md mx-auto shadow-2xl">
      <div className="h-full relative flex flex-col bg-white">
        <button onClick={onClose} className="fixed top-8 left-6 z-[650] p-3 bg-white/95 backdrop-blur-md rounded-2xl text-gray-900 shadow-xl active:scale-90 transition-transform">
          <BackIcon />
        </button>
        <div ref={scrollContainerRef} onScroll={handleHorizontalScroll} className="flex-1 flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory hide-scrollbar flex-nowrap pb-20">
          {recipes.map((recipe) => {
            const recipeColor = getRecipeColor(recipe.category);
            const isFavorite = favorites.includes(recipe.id);

            return (
              <div key={recipe.id} className="w-full h-full flex-shrink-0 snap-center flex flex-col">
                <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col pb-44 search-scroll-target">
                  <div className="relative w-full aspect-[4/3] flex-shrink-0 bg-gray-50 flex items-center justify-center overflow-visible border-b border-gray-100">
                    <div className="relative transform scale-[1.2] flex items-center justify-center">
                      {getRecipeIcon(recipe.name, recipe.category)}
                    </div>
                    <StickerTag label={recipe.category} color={recipeColor} className="bottom-12 right-6" />
                  </div>
                  
                  <div className="px-8 pb-12 -mt-16 relative z-[80]">
                    <div className="bg-white rounded-[40px] p-2">
                      <div className="flex justify-between items-start mb-1 gap-4">
                        <h1 className="text-3xl font-serif font-bold text-gray-900 leading-tight flex-1">
                          {recipe.name}
                        </h1>
                        <button onClick={() => onToggleFavorite(recipe.id)} className="mt-1 p-1 active:scale-90 transition-all bg-gray-50 rounded-2xl border border-white shadow-sm overflow-hidden">
                          <CollectionIcon active={isFavorite} className="w-14 h-14" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5C5C78]">Recipe Date</span>
                        <span className="text-[11px] font-normal uppercase tracking-[0.02em] text-gray-400 ml-[1px] inline-block origin-bottom transform scale-y-[1.12]">{recipe.date}</span>
                      </div>

                      <p className="text-gray-500 text-[13px] leading-relaxed mb-8 border-l-2 border-gray-100 pl-4 whitespace-pre-wrap">{recipe.description}</p>
                      
                      <div className="relative flex gap-1 p-1.5 bg-gray-100/60 backdrop-blur-sm rounded-[24px] mb-8 border border-gray-200/50 overflow-hidden">
                        <div 
                          className="absolute h-[calc(100%-12px)] w-[calc(50%-6px)] bg-white shadow-md rounded-[18px] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-0 border-b-2 border-gray-50 transform-gpu" 
                          style={{ transform: `translateX(${activeTab === 'ingredients' ? '0' : '100%'})` }} 
                        />
                        <button 
                          onClick={() => setActiveTab('ingredients')} 
                          className={`relative z-10 flex-1 py-3.5 flex items-center justify-center gap-2.5 font-black text-[10px] tracking-[0.15em] transition-colors duration-200 ${activeTab === 'ingredients' ? 'text-gray-900' : 'text-gray-400'}`}
                        >
                          <BasketIcon active={activeTab === 'ingredients'} />
                          ITEMS ({recipe.ingredients.length})
                        </button>
                        <button 
                          onClick={() => setActiveTab('steps')} 
                          className={`relative z-10 flex-1 py-3.5 flex items-center justify-center gap-2.5 font-black text-[10px] tracking-[0.15em] transition-colors duration-200 ${activeTab === 'steps' ? 'text-gray-900' : 'text-gray-400'}`}
                        >
                          <ChefHatIcon active={activeTab === 'steps'} />
                          STEPS ({recipe.steps.length})
                        </button>
                      </div>
                      
                      <TabContent 
                        activeTab={activeTab} 
                        recipe={recipe} 
                        checkedIngredients={checkedIngredients} 
                        onToggleIngredient={onToggleIngredient} 
                        onResetIngredients={onResetIngredients} 
                      />
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
  const handleVerify = useCallback(() => {
    if (pin === CORRECT_PASSWORD) onLogin();
    else { setError(true); setTimeout(() => { setError(false); setPin(''); }, 600); }
  }, [pin, onLogin]);
  useEffect(() => { if (pin.length === 3) handleVerify(); }, [pin, handleVerify]);
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
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const scrollMemoryRef = useRef<number>(0);
  const touchStartX = useRef<number | null>(null);

  const navRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem('kitchen_auth') === 'true') setIsAuth(true);
    const savedChecked = localStorage.getItem('kitchen_checked_v8');
    if (savedChecked) setCheckedIngredients(JSON.parse(savedChecked));
    const savedFavorites = localStorage.getItem('kitchen_favorites_v11');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
  }, [activeTab, deferredSearchQuery, selectedCategory]);

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

  const clearHighlights = useCallback(() => {
    const container = document.getElementById('recipes-container');
    const detailModal = document.querySelector('.fixed.inset-0.z-\\[600\\]');
    const targets = [container, detailModal].filter(Boolean) as Element[];
    targets.forEach(target => {
      target.querySelectorAll('mark.search-highlight').forEach(h => {
        const parent = h.parentNode;
        if (parent) { parent.replaceChild(document.createTextNode(h.textContent || ''), h); parent.normalize(); }
      });
      target.querySelectorAll('span[data-search-helper]').forEach(span => {
        const parent = span.parentNode;
        if (parent) { while(span.firstChild) parent.insertBefore(span.firstChild, span); parent.removeChild(span); parent.normalize(); }
      });
    });
  }, []);

  const highlightText = useCallback((query: string) => {
    clearHighlights();
    const cleanQuery = query.trim();
    if (!cleanQuery) return;
    const container = document.getElementById('recipes-container');
    const detailModal = document.querySelector('.fixed.inset-0.z-\\[600\\]');
    const targets = [container, detailModal].filter(Boolean) as Element[];
    const regex = new RegExp(`(${cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    targets.forEach(target => {
      const walk = document.createTreeWalker(target, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE' || parent.tagName === 'MARK' || parent.getAttribute('aria-hidden') === 'true')) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      const nodes: Text[] = [];
      let node;
      while (node = walk.nextNode()) nodes.push(node as Text);
      nodes.forEach(textNode => {
        if (regex.test(textNode.nodeValue || '')) {
          const span = document.createElement('span');
          span.setAttribute('data-search-helper', 'true');
          span.innerHTML = (textNode.nodeValue || '').replace(regex, '<mark class="search-highlight">$1</mark>');
          textNode.parentNode?.replaceChild(span, textNode);
        }
      });
    });
  }, [clearHighlights]);

  const filterFunction = useCallback((r: Recipe, q: string) => {
    return r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.ingredients.some(ing => ing.name.toLowerCase().includes(q)) || r.steps.some(step => step.toLowerCase().includes(q)) || (r.tips && r.tips.toLowerCase().includes(q));
  }, []);

  const filteredRecipes = useMemo(() => {
    const q = deferredSearchQuery.toLowerCase().trim();
    if (isSearchOpen && q) return RECIPES.filter(r => filterFunction(r, q));
    return selectedCategory === '全部' ? RECIPES : RECIPES.filter(r => r.category === selectedCategory);
  }, [selectedCategory, deferredSearchQuery, isSearchOpen, filterFunction]);

  const favoriteRecipes = useMemo(() => {
    let list = RECIPES.filter(r => favorites.includes(r.id));
    const q = deferredSearchQuery.toLowerCase().trim();
    if (isSearchOpen && q) list = list.filter(r => filterFunction(r, q));
    return list;
  }, [favorites, deferredSearchQuery, isSearchOpen, filterFunction]);

  const currentDisplayList = useMemo(() => activeTab === 'recipes' ? filteredRecipes : favoriteRecipes, [activeTab, filteredRecipes, favoriteRecipes]);

  useLayoutEffect(() => {
    if (isSearchOpen && deferredSearchQuery) {
      const timer = requestAnimationFrame(() => highlightText(deferredSearchQuery));
      return () => cancelAnimationFrame(timer);
    } else clearHighlights();
  }, [deferredSearchQuery, filteredRecipes, isSearchOpen, highlightText, clearHighlights, activeTab, selectedIndex]);

  const handleOpenSearch = useCallback(() => {
    if (scrollContainerRef.current) scrollMemoryRef.current = scrollContainerRef.current.scrollTop;
    setIsSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  }, []);

  const handleCloseSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSearchQuery('');
    clearHighlights();
    requestAnimationFrame(() => scrollContainerRef.current?.scrollTo({ top: scrollMemoryRef.current, behavior: 'smooth' }));
  }, [clearHighlights]);

  const handleToggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id];
      localStorage.setItem('kitchen_favorites_v11', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const handleResetIngredients = useCallback((ids: string[]) => {
    setCheckedIngredients(prev => {
      const newState = { ...prev };
      ids.forEach(id => { delete newState[id]; });
      localStorage.setItem('kitchen_checked_v8', JSON.stringify(newState));
      return newState;
    });
  }, []);

  // --- Category Swipe Navigation Implementation ---
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || isSearchOpen || activeTab !== 'recipes') return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    const threshold = 70; // min distance for swipe

    if (Math.abs(diff) > threshold) {
      const currentIndex = CATEGORIES.indexOf(selectedCategory);
      if (diff > 0) { // Swiped left -> Next category
        if (currentIndex < CATEGORIES.length - 1) {
          setSlideDirection('right');
          setSelectedCategory(CATEGORIES[currentIndex + 1]);
        }
      } else { // Swiped right -> Previous category
        if (currentIndex > 0) {
          setSlideDirection('left');
          setSelectedCategory(CATEGORIES[currentIndex - 1]);
        }
      }
    }
    touchStartX.current = null;
  };

  if (!isAuth) return <LoginView onLogin={() => { setIsAuth(true); sessionStorage.setItem('kitchen_auth', 'true'); }} />;

  return (
    <div className="h-[100dvh] bg-[#1A1A1A] font-sans max-w-md mx-auto relative flex flex-col shadow-2xl overflow-hidden">
      <div className="flex-1 bg-[#FDFBF7] relative flex flex-col h-full overflow-hidden">
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[900] w-[calc(100%-2rem)] max-w-[360px] transition-all duration-500 transform ${isSearchOpen ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-20 opacity-0 scale-95 pointer-events-none'}`}>
          <div className="relative group">
            <div className="absolute inset-0 bg-white/15 backdrop-blur-[1px] rounded-full border border-white/30 shadow-glass pointer-events-none" />
            <div className="relative flex items-center px-6 py-4 gap-3">
              <span className="text-gray-900"><SearchIcon /></span>
              <input ref={searchInputRef} type="text" placeholder="Search globally..." className="flex-1 bg-transparent border-none outline-none text-[14px] font-bold text-gray-900 placeholder-gray-400" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <button type="button" onClick={handleCloseSearch} className="text-gray-400 hover:text-gray-900"><CloseIcon /></button>
            </div>
          </div>
        </div>

        <div className="fixed bottom-28 right-6 z-[800]">
          <button onClick={isSearchOpen ? handleCloseSearch : handleOpenSearch} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 active:scale-90 shadow-glass border border-white/30 backdrop-blur-[1px] ${isSearchOpen ? 'bg-[#5C5C78] text-white rotate-90' : 'bg-white/15 text-gray-900'}`}>
            {isSearchOpen ? <CloseIcon /> : <SearchIcon />}
          </button>
        </div>

        <div className="flex-shrink-0 z-[100] bg-[#FDFBF7]/95 backdrop-blur-xl border-b border-gray-100">
          <header className="px-8 pt-10 pb-4">
            <div className="flex justify-between items-end mb-8">
              <h1 className="text-[36px] font-serif font-bold text-gray-900 leading-none">Kitchen Vault</h1>
              <div className="w-12 h-12 rounded-[28%] bg-white p-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-50 flex items-center justify-center">
                <img src="isa_icon.svg" className="w-full h-full object-contain" alt="Vault Icon" />
              </div>
            </div>
            {activeTab === 'recipes' ? (
              <div ref={navRef} className="relative flex items-center h-10 overflow-x-auto hide-scrollbar gap-2.5 scroll-smooth">
                <div className="absolute top-1/2 -translate-y-1/2 h-9 bg-[#5C5C78] rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-0 transform-gpu" style={{ left: categoryIndicatorStyle.left, width: categoryIndicatorStyle.width }} />
                {CATEGORIES.map((cat, idx) => (
                  <button key={cat} ref={el => { categoryRefs.current[cat] = el; }} onClick={() => { const oldIdx = CATEGORIES.indexOf(selectedCategory); setSlideDirection(idx > oldIdx ? 'right' : 'left'); setSelectedCategory(cat); }} className={`group relative z-10 px-5 h-10 rounded-full flex items-center justify-center gap-2 text-[11px] font-bold tracking-tight transition-all duration-500 whitespace-nowrap ${selectedCategory === cat ? 'text-white' : 'text-gray-400'}`}>
                    {getCategoryMiniIcon(cat)}
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="pb-3 px-1">
                <div className="flex items-center justify-between p-2 bg-white/60 backdrop-blur-xl border border-white/80 rounded-[20px]">
                  <div className="flex items-center gap-3 pl-3">
                    <div className="p-1.5 bg-[#5C5C78]/10 rounded-lg text-[#5C5C78]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 leading-none mb-1">Selection</span>
                      <span className="text-[13px] font-black text-[#5C5C78]">{favoriteRecipes.length} <span className="text-[10px] opacity-40">ITEMS</span></span>
                    </div>
                  </div>
                  {!isSearchOpen && favorites.length > 0 && (
                    <button onClick={() => { setFavorites([]); localStorage.setItem('kitchen_favorites_v11', '[]'); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#5C5C78] rounded-[14px] text-[10px] font-black uppercase tracking-widest text-white active:scale-95 shadow-lg shadow-[#5C5C78]/20 group">
                      <span className="group-active:rotate-180 transition-transform duration-500"><ResetIcon /></span>Reset
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
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex-1 overflow-y-auto hide-scrollbar pt-6 pb-44"
        >
          {currentDisplayList.length > 0 ? (
            <main className="px-8 min-h-full">
              <div className={`grid grid-cols-2 gap-x-4 gap-y-12 animate-in duration-700 ${slideDirection === 'right' ? 'slide-in-from-right-20 fade-in' : 'slide-in-from-left-20 fade-in'}`}>
                {currentDisplayList.map((recipe, idx) => {
                  const isFavorite = favorites.includes(recipe.id);
                  const q = deferredSearchQuery.toLowerCase().trim();
                  return (
                    <div key={recipe.id} onClick={() => setSelectedIndex(idx)} className="group relative bg-white rounded-[32px] p-4 flex flex-col shadow-sm border border-gray-100 active:scale-[0.96] transition-all cursor-pointer">
                      <button onClick={(e) => { e.stopPropagation(); handleToggleFavorite(recipe.id); }} className="absolute -top-3 -left-3 z-[120] active:scale-90"><CollectionIcon active={isFavorite} className="w-12 h-12" /></button>
                      <div className="w-full aspect-square rounded-[24px] overflow-visible shadow-sm mb-4 flex items-center justify-center relative bg-gray-50/50">
                        <div className="transition-transform duration-700 group-hover:scale-110 flex items-center justify-center">{getRecipeIcon(recipe.name, recipe.category)}</div>
                        <StickerTag label={recipe.category} color={getRecipeColor(recipe.category)} className="top-2 -right-4" />
                      </div>
                      <div className="px-1 flex flex-col items-start">
                        <h4 className="text-[14px] font-serif font-bold text-slate-900 leading-tight line-clamp-2 mb-0.5">{recipe.name}</h4>
                        {isSearchOpen && q && (
                          <div className="mt-2 space-y-1 border-t border-gray-50 pt-2">
                            {recipe.ingredients.some(i => i.name.toLowerCase().includes(q)) && (
                              <p className="text-[9px] text-[#5C5C78] font-bold uppercase tracking-wider">食材匹配: {recipe.ingredients.filter(i => i.name.toLowerCase().includes(q)).map(i => i.name).join(', ')}</p>
                            )}
                            {(recipe.steps.some(s => s.toLowerCase().includes(q)) || (recipe.tips && recipe.tips.toLowerCase().includes(q))) && (
                              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5"><StepIcon /> 匹配步驟內容</p>
                            )}
                          </div>
                        )}
                        <span className="mt-2 text-[11px] font-normal uppercase tracking-[0.02em] text-gray-400 ml-[1px] inline-block origin-bottom transform scale-y-[1.12]">{recipe.date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </main>
          ) : (
            <div className="px-8 min-h-full flex flex-col items-center justify-center text-center pb-24">
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">{isSearchOpen ? 'No Global Matches' : 'The Black Book is Empty'}</h3>
              <img src="chef_blue.svg" className="w-32 h-32 mb-4 opacity-60" alt="Chef" />
              
              <p className="text-[13px] font-bold uppercase tracking-[0.02em] text-slate-400 mb-6 leading-relaxed">
                SPICE THINGS UP!
              </p>

              <button 
                onClick={() => {
                  setActiveTab('recipes');
                  setSelectedCategory('全部');
                  handleCloseSearch();
                }} 
                className="bg-gray-900 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-transform"
              >
                ADD TO VAULT
              </button>
            </div>
          )}
        </div>
      </div>

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-2xl border border-white/60 p-1 rounded-full shadow-mystic z-[700] w-[calc(100%-4rem)] max-w-[320px]">
        <div className="relative flex items-center h-14">
          <div className="absolute top-1/2 -translate-y-1/2 w-14 h-14 bg-gray-100/90 rounded-full transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] z-0 transform-gpu" style={{ left: activeTab === 'recipes' ? '25%' : '75%', transform: 'translate(-50%, -50%)' }} />
          <button onClick={() => { setSelectedIndex(null); if (activeTab === 'recipes') { setSelectedCategory('全部'); handleCloseSearch(); } else setActiveTab('recipes'); }} className="flex-1 h-full flex flex-col items-center justify-center relative z-10 active:scale-90 transition-transform">
            <RecipeIcon active={activeTab === 'recipes'} />
            <span className={`text-[9px] font-black uppercase mt-1 ${activeTab === 'recipes' ? 'text-[#5C5C78]' : 'text-gray-400'}`}>Recipes</span>
          </button>
          <button onClick={() => { setSelectedIndex(null); setActiveTab('menu'); }} className="flex-1 h-full flex flex-col items-center justify-center relative z-10 active:scale-90 transition-transform">
            <MenuIcon active={activeTab === 'menu'} />
            <span className={`text-[9px] font-black uppercase mt-1 ${activeTab === 'menu' ? 'text-[#5C5C78]' : 'text-gray-400'}`}>Menu</span>
          </button>
        </div>
      </nav>

      {selectedIndex !== null && (
        <RecipeDetail 
          selectedIndex={selectedIndex} 
          onClose={() => setSelectedIndex(null)} 
          checkedIngredients={checkedIngredients} 
          onToggleIngredient={(id) => setCheckedIngredients(p => ({ ...p, [id]: !p[id] }))} 
          onResetIngredients={handleResetIngredients} 
          recipes={currentDisplayList} 
          favorites={favorites} 
          onToggleFavorite={handleToggleFavorite} 
          searchQuery={deferredSearchQuery} 
          onRefreshHighlight={() => highlightText(deferredSearchQuery)} 
        />
      )}
    </div>
  );
}
