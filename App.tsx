
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

// --- Custom Gourmet Illustrative Icons (Internal Components for Other Categories) ---
const TofuIllus = () => (
  <svg width="80" height="80" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="16" width="32" height="32" rx="4" fill="#F5F5F4" fillOpacity="0.9" stroke="#A8A29E" strokeWidth="1.5"/>
    <path d="M44 20L52 24V52L44 48V20Z" fill="#E7E5E4" stroke="#A8A29E" strokeWidth="1.5"/>
    <path d="M16 16L24 8H52L44 16H16Z" fill="#E7E5E4" stroke="#A8A29E" strokeWidth="1.5"/>
    <circle cx="24" cy="28" r="1.5" fill="#15803D" fillOpacity="0.5"/>
    <circle cx="34" cy="38" r="1" fill="#15803D" fillOpacity="0.5"/>
  </svg>
);

const NoodleIllus = () => (
  <svg width="80" height="80" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 28C12 44 18 52 32 52C46 52 52 44 52 28H12Z" fill="#FDE68A" fillOpacity="0.4" stroke="#D97706" strokeWidth="1.5"/>
    <path d="M16 28C16 20 20 12 24 12" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M24 28C24 20 28 12 32 12" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M32 28C32 20 36 12 40 12" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M40 28C40 20 44 12 48 12" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 8L56 16" stroke="#57534E" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const RiceIllus = () => (
  <svg width="80" height="80" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 36C12 20 20 12 32 12C44 12 52 20 52 36H12Z" fill="white" stroke="#D1D5DB" strokeWidth="1.5"/>
    <path d="M8 36H56V44C56 52 48 56 32 56C16 56 8 52 8 44V36Z" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1.5"/>
    <path d="M28 24H36" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M30 20H34" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const DessertChineseIllus = () => (
  <svg width="80" height="80" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="20" fill="#FDE2E4" fillOpacity="0.6" stroke="#FF85A2" strokeWidth="1.5"/>
    <path d="M24 28C24 28 28 24 32 28C36 32 40 28 40 28" stroke="#FF85A2" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="32" cy="32" r="4" fill="#EF4444" fillOpacity="0.2"/>
  </svg>
);

const DessertWestIllus = () => (
  <svg width="80" height="80" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 48H48V56H16V48Z" fill="#F9A8D4" stroke="#DB2777" strokeWidth="1.5"/>
    <path d="M20 28C20 20 24 16 32 16C40 16 44 20 44 28V48H20V28Z" fill="#FDF2F8" stroke="#DB2777" strokeWidth="1.5"/>
    <circle cx="32" cy="12" r="4" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5"/>
    <path d="M28 48V32M36 48V36" stroke="#FBCFE8" strokeWidth="1.5"/>
  </svg>
);

const SauceIllus = () => (
  <svg width="80" height="80" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 24V12H42V24" stroke="#57534E" strokeWidth="2" strokeLinecap="round"/>
    <rect x="18" y="24" width="28" height="32" rx="4" fill="#E9D5FF" fillOpacity="0.5" stroke="#9333EA" strokeWidth="1.5"/>
    <path d="M24 12H40" stroke="#57534E" strokeWidth="3" strokeLinecap="round"/>
    <rect x="22" y="34" width="20" height="12" fill="white" fillOpacity="0.8" stroke="#D8B4FE" strokeWidth="1"/>
  </svg>
);

// --- Helper Functions ---
const getRecipeIcon = (name: string, category: string) => {
  // 指定外部資源：肉類料理
  if (name.includes('雞') || name.includes('肉') || name.includes('豬') || name.includes('牛') || category === '肉類料理') {
    return <img src="meat.svg" className="w-20 h-20 object-contain" alt="Meat" />;
  }
  // 指定外部資源：海鮮料理
  if (name.includes('魚') || name.includes('蝦') || name.includes('海鮮') || name.includes('干貝') || category === '海鮮料理') {
    return <img src="seafood.svg" className="w-20 h-20 object-contain" alt="Seafood" />;
  }
  // 指定外部資源：蛋類料理
  if (name.includes('蛋') || category === '蛋類料理') {
    return <img src="egg.svg" className="w-20 h-20 object-contain" alt="Egg" />;
  }
  // 指定外部資源：蔬食料理
  if (name.includes('花椰菜') || name.includes('蔬') || name.includes('菜') || category === '蔬食料理') {
    return <img src="vegetable.svg" className="w-20 h-20 object-contain" alt="Vegetable" />;
  }
  // 指定外部資源：湯品鍋物 (NEW)
  if (name.includes('湯') || name.includes('鍋') || name.includes('煲') || name.includes('湯圓') || category === '湯品鍋物') {
    return <img src="soup.svg" className="w-20 h-20 object-contain" alt="Soup" />;
  }
  
  // 其餘類別使用內建插畫組件
  if (name.includes('豆腐') || name.includes('豆皮') || name.includes('豆乾') || category === '豆腐料理') return <TofuIllus />;
  if (name.includes('麵') || name.includes('通心粉') || name.includes('拉麵') || category === '麵類料理') return <NoodleIllus />;
  if (name.includes('飯') || name.includes('燉飯') || category === '飯類料理') return <RiceIllus />;
  if (name.includes('蛋糕') || name.includes('派') || category === '西式甜點') return <DessertWestIllus />;
  if (name.includes('紅豆') || category === '中式甜點') return <DessertChineseIllus />;
  if (name.includes('醬') || name.includes('餡') || category === '自製醬餡') return <SauceIllus />;
  
  return <img src="soup.svg" className="w-20 h-20 object-contain" alt="Soup" />; // Default fallback
};

const getRecipeClassification = (name: string) => {
  if (name.includes('鹹湯圓')) return { label: '湯品鍋物', color: 'bg-[#A3B8C2] text-white border-[#92A7B1]' };
  if (name.includes('醬') || name.includes('餡') || name.includes('抹醬')) return { label: '自製醬餡', color: 'bg-[#8FA8A3] text-white border-[#7E9893]' };
  if (name.includes('湯圓') || name.includes('紅豆') || name.includes('中式') || name.includes('粥')) return { label: '中式甜點', color: 'bg-[#C2A3A3] text-white border-[#B18F8F]' };
  if (name.includes('蛋糕') || name.includes('塔') || name.includes('餅乾') || name.includes('派') || name.includes('西式') || name.includes('慕斯')) return { label: '西式甜點', color: 'bg-[#D4B2C2] text-white border-[#C3A1B1]' };
  if (name.includes('豆腐') || name.includes('豆皮') || name.includes('豆乾')) return { label: '豆腐料理', color: 'bg-[#E6D5C3] text-[#7A6B5A] border-[#D5C4B2]' };
  if (name.includes('湯') || name.includes('鍋') || name.includes('煲')) return { label: '湯品鍋物', color: 'bg-[#A3B8C2] text-white border-[#92A7B1]' };
  if (name.includes('麵') || name.includes('通心粉') || name.includes('義大利') || name.includes('拉麵')) return { label: '麵類料理', color: 'bg-[#D9C5B2] text-white border-[#C4B2A1]' };
  if (name.includes('飯') || name.includes('燉飯')) return { label: '飯類料理', color: 'bg-[#BFB8AD] text-white border-[#A8A196]' };
  if (name.includes('雞') || name.includes('肉') || name.includes('豬') || name.includes('牛')) return { label: '肉類料理', color: 'bg-[#C2B2A3] text-white border-[#B1A08F]' };
  if (name.includes('魚') || name.includes('蝦') || name.includes('海鮮') || name.includes('干貝')) return { label: '海鮮料理', color: 'bg-[#8FB0C2] text-white border-[#7E9EB0]' };
  if (name.includes('蛋')) return { label: '蛋類料理', color: 'bg-[#F2D06B] text-[#7A6124] border-[#E5C35D]' };
  if (name.includes('三杯') || name.includes('炒') || name.includes('花椰菜') || name.includes('蔬') || name.includes('菜')) return { label: '蔬食料理', color: 'bg-[#A3C2A3] text-[#3D523D] border-[#8FB18F]' };
  
  return { label: '肉類料理', color: 'bg-[#C2B2A3] text-white border-[#B1A08F]' };
};

const CATEGORIES = [
  '全部',
  '肉類料理',
  '海鮮料理',
  '蔬食料理',
  '湯品鍋物',
  '蛋類料理',
  '豆腐料理',
  '麵類料理',
  '飯類料理',
  '中式甜點',
  '西式甜點',
  '自製醬餡'
];

// --- Sub-Components ---
const StickerTag: React.FC<{ classification: { label: string, color: string }, className?: string }> = ({ classification, className }) => (
  <div className={`
    absolute z-[110] px-3 py-1.5 
    text-[10px] font-black uppercase tracking-widest 
    shadow-[4px_4px_15px_-2px_rgba(0,0,0,0.4)] 
    border border-white/30
    rotate-[4deg] origin-center
    pointer-events-none
    ${classification.color} ${className}
  `}>
    {classification.label}
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
}> = ({ selectedIndex, onClose, checkedIngredients, onToggleIngredient, onResetIngredients, recipes }) => {
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
    <div className="fixed inset-0 z-[200] bg-[#FDFBF7] overflow-hidden font-sans max-w-md mx-auto">
      <div className="h-full relative flex flex-col bg-white">
        <button onClick={onClose} className="fixed top-8 left-6 z-[300] p-3 bg-white/95 backdrop-blur-md rounded-2xl text-gray-900 shadow-xl active:scale-90 transition-transform">
          <BackIcon />
        </button>
        <div ref={scrollContainerRef} onScroll={handleHorizontalScroll} className="flex-1 flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory hide-scrollbar flex-nowrap">
          {recipes.map((recipe) => {
            const classification = getRecipeClassification(recipe.name);
            const recipeIngIds = recipe.ingredients.map(i => i.id);
            const hasCheckedIngredients = recipeIngIds.some(id => checkedIngredients[id]);
            return (
              <div key={recipe.id} className="w-full h-full flex-shrink-0 snap-center flex flex-col">
                <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col pb-44">
                  <div className="relative w-full aspect-[4/3] flex-shrink-0 bg-gray-50 flex items-center justify-center overflow-visible border-b border-gray-100">
                    <div className="relative transform scale-[1.2] flex items-center justify-center">
                      {getRecipeIcon(recipe.name, classification.label)}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-20" />
                    <StickerTag classification={classification} className="bottom-12 right-6" />
                  </div>
                  
                  <div className="px-8 pb-12 -mt-16 relative z-[80]">
                    <div className="bg-white rounded-[40px] p-2">
                      <h1 className="text-3xl font-serif font-bold text-gray-900 leading-tight mb-4">{recipe.name}</h1>
                      <p className="text-gray-500 text-[13px] leading-relaxed mb-8 border-l-2 border-gray-100 pl-4">{recipe.description}</p>
                      
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
                                    <span className={`text-sm font-semibold ${isChecked ? 'text-gray-300 line-through' : 'text-gray-800'}`}>{ing.name}</span>
                                  </div>
                                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{ing.amount}</span>
                                </div>
                              );
                            })}
                          </>
                        ) : (
                          <div className="space-y-6 pt-4">
                            {recipe.steps.map((step, i) => (
                              <div key={i} className="flex gap-4 items-start">
                                <div className="w-6 h-6 rounded-lg bg-[#5C5C78] text-white flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">{i + 1}</div>
                                <p className="text-gray-600 text-[14px] font-medium leading-relaxed">{step}</p>
                              </div>
                            ))}
                            {recipe.tips && (
                              <div className="mt-14 relative">
                                <div className="absolute -top-3 left-6 z-20">
                                  <div className="inline-flex items-center px-3 py-1 bg-[#5C5C78]/90 backdrop-blur-sm rounded-full border border-white/30 shadow-sm">
                                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="mr-1.5 opacity-80"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                                    <span className="text-white text-[8px] font-black tracking-[0.2em] uppercase opacity-90">Secret Tip</span>
                                  </div>
                                </div>
                                <div className="bg-[#FDFBF7] rounded-[32px] p-7 pt-11 border border-gray-100/50 shadow-sm relative overflow-hidden">
                                  <p className="text-[#5A5A5A] text-[12.5px] font-semibold leading-[1.85] whitespace-pre-wrap">{recipe.tips}</p>
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
        <div className="mb-8 drop-shadow-2xl"><img src="chef_2.svg" className="w-24 h-24 object-contain" alt="Logo" /></div>
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
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const navRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem('kitchen_auth') === 'true') setIsAuth(true);
    const saved = localStorage.getItem('kitchen_checked_v8');
    if (saved) setCheckedIngredients(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (navRef.current) {
      const activeBtn = navRef.current.querySelector('[data-active="true"]') as HTMLElement;
      if (activeBtn) {
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

  const handleResetIngredients = (ids: string[]) => {
    const newState = { ...checkedIngredients };
    ids.forEach(id => { delete newState[id]; });
    setCheckedIngredients(newState);
    localStorage.setItem('kitchen_checked_v8', JSON.stringify(newState));
  };

  const filteredRecipes = useMemo(() => {
    if (selectedCategory === '全部') return RECIPES;
    return RECIPES.filter(r => getRecipeClassification(r.name).label === selectedCategory);
  }, [selectedCategory]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartRef.current = e.touches[0].clientX; };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;
    const currentIndex = CATEGORIES.indexOf(selectedCategory);
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < CATEGORIES.length - 1) { setSlideDirection('right'); setSelectedCategory(CATEGORIES[currentIndex + 1]); }
      else if (diff < 0 && currentIndex > 0) { setSlideDirection('left'); setSelectedCategory(CATEGORIES[currentIndex - 1]); }
    }
    touchStartRef.current = null;
  };

  if (!isAuth) return <LoginView onLogin={() => { setIsAuth(true); sessionStorage.setItem('kitchen_auth', 'true'); }} />;

  return (
    <div className="h-[100dvh] bg-[#1A1A1A] font-sans max-w-md mx-auto relative flex flex-col shadow-2xl overflow-hidden">
      <div className="flex-1 bg-[#FDFBF7] relative flex flex-col h-full overflow-hidden">
        <div className="flex-shrink-0 z-[100] bg-[#FDFBF7]/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
          <header className="px-8 pt-10 pb-4">
            <div className="flex justify-between items-end mb-8">
              <h1 className="text-[36px] font-serif font-bold text-gray-900 leading-none">Kitchen Vault</h1>
              <div className="w-12 h-12 rounded-[14px] bg-white p-1.5 shadow-mystic border border-gray-50 flex items-center justify-center"><img src="https://i.pravatar.cc/150?u=chef" className="w-full h-full object-cover rounded-[10px]" alt="Chef Avatar" /></div>
            </div>
            
            {activeTab === 'recipes' && (
              <div ref={navRef} className="flex overflow-x-auto hide-scrollbar gap-2.5 pb-2 scroll-smooth">
                {CATEGORIES.map((cat, idx) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button key={cat} data-active={isActive} onClick={() => { const oldIdx = CATEGORIES.indexOf(selectedCategory); setSlideDirection(idx > oldIdx ? 'right' : 'left'); setSelectedCategory(cat); }} className={`px-5 py-2.5 rounded-full text-[11px] font-bold tracking-tight transition-all duration-300 whitespace-nowrap ${isActive ? 'bg-[#5C5C78] text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-gray-200/60'}`}>{cat}</button>
                  );
                })}
              </div>
            )}
          </header>
        </div>
        <div className="flex-1 overflow-y-auto hide-scrollbar pt-6 pb-32">
          {activeTab === 'recipes' ? (
            <main className="px-8 min-h-full select-none" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
              <div key={selectedCategory} className={`grid grid-cols-2 gap-x-4 gap-y-12 animate-in duration-500 ease-out fill-mode-both ${slideDirection === 'right' ? 'slide-in-from-right-8 fade-in' : 'slide-in-from-left-8 fade-in'}`}>
                {filteredRecipes.length > 0 ? (
                  filteredRecipes.map((recipe, index) => {
                    const classification = getRecipeClassification(recipe.name);
                    return (
                      <div key={recipe.id} onClick={() => setSelectedIndex(index)} className="group relative bg-white rounded-[32px] p-4 flex flex-col shadow-sm border border-gray-100 active:scale-[0.97] transition-all hover:shadow-mystic cursor-pointer overflow-visible">
                        <div className={`w-full aspect-square rounded-[24px] overflow-visible shadow-sm mb-4 flex items-center justify-center relative transition-all duration-500 group-hover:shadow-md bg-gray-50/50`}>
                          <div className="transition-transform duration-700 group-hover:scale-110 flex items-center justify-center">
                            {getRecipeIcon(recipe.name, classification.label)}
                          </div>
                          <StickerTag classification={classification} className="top-2 -right-4" />
                        </div>
                        <h4 className="text-[15px] font-serif font-bold text-gray-900 px-1 leading-tight line-clamp-2">{recipe.name}</h4>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-2 py-20 text-center"><p className="text-gray-400 font-serif italic mb-2">No secrets found here.</p><button onClick={() => setSelectedCategory('全部')} className="text-[10px] font-black uppercase tracking-widest text-[#5C5C78] underline">Reset Filter</button></div>
                )}
              </div>
            </main>
          ) : (
            <div className="px-8 pt-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">The Menu</h1>
              <p className="text-sm text-gray-400 mb-12">Curate your next culinary masterpiece.</p>
              <div className="bg-white rounded-[40px] p-12 border border-dashed border-gray-200 flex flex-col items-center space-y-6">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={PRIMARY_COLOR} strokeWidth="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2 v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg></div>
                <h3 className="text-xl font-serif font-bold">Empty Vault</h3>
                <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-xl active:scale-95 transition-all">Generate Suggestion</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-2xl border border-white/60 p-1.5 rounded-full shadow-mystic z-[150] w-[calc(100%-4rem)] max-w-[320px]">
        <div className="relative flex items-center h-14">
          <div className="absolute top-0 bottom-0 transition-all duration-300 ease-out bg-gray-100/90 rounded-full z-0" style={{ width: '50%', left: activeTab === 'recipes' ? '0%' : '50%' }} />
          <button onClick={() => setActiveTab('recipes')} className="flex-1 flex flex-col items-center justify-center relative z-10"><RecipeIcon active={activeTab === 'recipes'} /><span className={`text-[9px] font-black uppercase mt-1 tracking-tighter ${activeTab === 'recipes' ? 'text-[#5C5C78]' : 'text-gray-400'}`}>Recipes</span></button>
          <button onClick={() => setActiveTab('menu')} className="flex-1 flex flex-col items-center justify-center relative z-10"><MenuIcon active={activeTab === 'menu'} /><span className={`text-[9px] font-black uppercase mt-1 tracking-tighter ${activeTab === 'menu' ? 'text-[#5C5C78]' : 'text-gray-400'}`}>Menu</span></button>
        </div>
      </nav>
      {selectedIndex !== null && (
        <RecipeDetail selectedIndex={selectedIndex} onClose={() => setSelectedIndex(null)} checkedIngredients={checkedIngredients} onToggleIngredient={handleToggle} onResetIngredients={handleResetIngredients} recipes={filteredRecipes} />
      )}
    </div>
  );
}
