
import React, { useState, useEffect, useRef } from 'react';
import { RECIPES } from './constants';
import { Recipe } from './types';

const CORRECT_PASSWORD = '333';
const PRIMARY_COLOR = '#5C5C78';

// --- Icons ---
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

// --- Utilities ---
const getRecipeClassification = (name: string) => {
  if (name.includes('雞') || name.includes('肉')) return { label: '肉類料理', color: 'bg-[#C2B2A3] text-white border-[#B1A08F]' };
  if (name.includes('蛋')) return { label: '蛋料理', color: 'bg-[#F2D06B] text-[#7A6124] border-[#E5C35D]' };
  if (name.includes('魚') || name.includes('蝦') || name.includes('海鮮')) return { label: '海鮮料理', color: 'bg-[#8FB0C2] text-white border-[#7E9EB0]' };
  if (name.includes('松露') || name.includes('法式') || name.includes('義式')) return { label: '精緻歐陸', color: 'bg-[#B0A3C2] text-white border-[#9E90B0]' };
  if (name.includes('三杯') || name.includes('炒') || name.includes('花椰菜') || name.includes('蔬')) return { label: '蔬食料理', color: 'bg-[#A3C2A3] text-[#3D523D] border-[#8FB18F]' };
  return { label: '家常美食', color: 'bg-[#D1D1D1] text-[#4A4A4A] border-[#C1C1C1]' };
};

// --- Sub-Components ---
const StickerTag: React.FC<{ classification: { label: string, color: string }, className?: string }> = ({ classification, className }) => (
  <div className={`
    absolute z-30 px-3 py-1.5 
    text-[10px] font-black uppercase tracking-widest 
    shadow-[3px_3px_10px_-2px_rgba(0,0,0,0.3)] 
    rotate-2 origin-top-right
    after:content-[''] after:absolute after:bottom-0 after:right-0 
    after:w-2 after:h-2 after:bg-black/5 after:shadow-[-1px_-1px_2px_rgba(0,0,0,0.1)]
    ${classification.color} ${className}
  `}>
    {classification.label}
  </div>
);

const RecipeDetail: React.FC<{ 
  selectedIndex: number;
  onClose: () => void;
  checkedIngredients: Record<string, boolean>;
  onToggleIngredient: (id: string) => void;
}> = ({ selectedIndex, onClose, checkedIngredients, onToggleIngredient }) => {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps'>('ingredients');
  const [currentCardIndex, setCurrentCardIndex] = useState(selectedIndex);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 修復點擊卡片顯示錯誤頁面的核心邏輯
  useEffect(() => {
    const performScroll = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        // 確保子元素已經渲染且 selectedIndex 合法
        const card = container.children[selectedIndex] as HTMLElement;
        if (card) {
          container.scrollTo({
            left: card.offsetLeft,
            behavior: 'auto'
          });
          setCurrentCardIndex(selectedIndex);
        }
      }
    };

    // 使用 requestAnimationFrame 確保在 DOM 佈局完成後才滾動
    const animationId = requestAnimationFrame(() => {
      // 雙重確保，有時需要兩個 frame 確保寬度計算準確
      requestAnimationFrame(performScroll);
    });

    return () => cancelAnimationFrame(animationId);
  }, [selectedIndex]);

  const handleHorizontalScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = container.clientWidth;
    if (cardWidth === 0) return;
    
    const newIndex = Math.round(container.scrollLeft / cardWidth);

    if (newIndex !== currentCardIndex && newIndex >= 0 && newIndex < RECIPES.length) {
      setCurrentCardIndex(newIndex);
      // 切換頁面時重置滾動位置，確保內容從頭開始看
      const scrollableAreas = container.querySelectorAll('.card-content-scroll');
      scrollableAreas.forEach(area => {
        area.scrollTop = 0;
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#FDFBF7] overflow-hidden font-sans max-w-md mx-auto">
      <div className="h-full relative flex flex-col bg-white">
        {/* Back Button */}
        <button 
          onClick={onClose} 
          className="fixed top-8 left-6 z-[120] p-3 bg-white/95 backdrop-blur-md rounded-2xl text-gray-900 shadow-xl active:scale-90 transition-transform"
        >
          <BackIcon />
        </button>

        {/* Swipe Container */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleHorizontalScroll}
          className="flex-1 flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory hide-scrollbar flex-nowrap"
        >
          {RECIPES.map((recipe) => {
            const classification = getRecipeClassification(recipe.name);
            return (
              <div key={recipe.id} className="w-full h-full flex-shrink-0 snap-center flex flex-col">
                <div className="card-content-scroll flex-1 overflow-y-auto hide-scrollbar flex flex-col pb-44">
                  <div className="relative w-full aspect-[4/5] flex-shrink-0 overflow-hidden">
                    <img src={recipe.image} className="w-full h-full object-cover" alt={recipe.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/10" />
                    <StickerTag classification={classification} className="bottom-8 right-8" />
                  </div>
                  
                  <div className="px-8 pb-12 -mt-12 relative z-10">
                    <div className="bg-white rounded-[40px] p-2">
                      <h1 className="text-3xl font-serif font-bold text-gray-900 leading-tight mb-4">{recipe.name}</h1>
                      <p className="text-gray-500 text-[13px] leading-relaxed mb-8 border-l-2 border-gray-100 pl-4">{recipe.description}</p>
                      
                      <div className="flex gap-1 p-1 bg-gray-50 rounded-2xl mb-8">
                        <button onClick={() => setActiveTab('ingredients')} className={`flex-1 py-3 rounded-xl font-bold text-[10px] tracking-widest transition-all ${activeTab === 'ingredients' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}>ITEMS ({recipe.ingredients.length})</button>
                        <button onClick={() => setActiveTab('steps')} className={`flex-1 py-3 rounded-xl font-bold text-[10px] tracking-widest transition-all ${activeTab === 'steps' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}>STEPS ({recipe.steps.length})</button>
                      </div>

                      <div className="space-y-4">
                        {activeTab === 'ingredients' ? (
                          recipe.ingredients.map((ing) => {
                            const isChecked = checkedIngredients[ing.id];
                            return (
                              <div key={ing.id} onClick={() => onToggleIngredient(ing.id)} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/60 border border-transparent active:border-gray-200 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isChecked ? 'bg-[#5C5C78] border-[#5C5C78]' : 'border-gray-200'}`}>
                                    {isChecked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                  </div>
                                  <span className={`text-sm font-semibold ${isChecked ? 'text-gray-300 line-through' : 'text-gray-800'}`}>{ing.name}</span>
                                </div>
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{ing.amount}</span>
                              </div>
                            );
                          })
                        ) : (
                          <div className="space-y-6">
                            {recipe.steps.map((step, i) => (
                              <div key={i} className="flex gap-4 items-start">
                                <div className="w-6 h-6 rounded-lg bg-[#5C5C78] text-white flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">{i + 1}</div>
                                <p className="text-gray-600 text-[14px] font-medium leading-relaxed">{step}</p>
                              </div>
                            ))}
                            
                            {/* --- Redesigned High-Quality MEMO --- */}
                            {recipe.tips && (
                              <div className="mt-16 relative">
                                <div className="absolute -top-3 left-6 z-20">
                                  <div className="inline-flex items-center px-4 py-1.5 bg-[#5C5C78] rounded-full shadow-lg border-2 border-white">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="mr-2">
                                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                    </svg>
                                    <span className="text-white text-[9px] font-black tracking-widest uppercase">Secret Tip</span>
                                  </div>
                                </div>
                                <div className="bg-[#FDFBF7] rounded-[32px] p-8 pt-10 border border-gray-100 shadow-sm relative overflow-hidden">
                                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#5C5C78] opacity-20" />
                                  <p className="text-gray-500 text-[12.5px] font-medium leading-relaxed whitespace-pre-wrap">
                                    {recipe.tips}
                                  </p>
                                  <div className="mt-6 flex justify-end">
                                    <span className="text-[10px] font-serif italic text-gray-300">— Kitchen Vault Master</span>
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
    <div className="min-h-[100dvh] bg-[#FDFBF7] flex flex-col items-center justify-between py-24 px-8 font-sans max-w-md mx-auto relative overflow-hidden">
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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (sessionStorage.getItem('kitchen_auth') === 'true') setIsAuth(true);
    const saved = localStorage.getItem('kitchen_checked_v8');
    if (saved) setCheckedIngredients(JSON.parse(saved));
  }, []);

  const handleToggle = (id: string) => {
    const newState = { ...checkedIngredients, [id]: !checkedIngredients[id] };
    setCheckedIngredients(newState);
    localStorage.setItem('kitchen_checked_v8', JSON.stringify(newState));
  };

  const navToRecipes = () => {
    setSelectedIndex(null);
    setActiveTab('recipes');
  };

  const navToMenu = () => {
    setSelectedIndex(null);
    setActiveTab('menu');
  };

  if (!isAuth) return <LoginView onLogin={() => { setIsAuth(true); sessionStorage.setItem('kitchen_auth', 'true'); }} />;

  return (
    <div className="min-h-[100dvh] bg-[#FDFBF7] font-sans overflow-hidden max-w-md mx-auto shadow-2xl relative flex flex-col">
      <div className="flex-1 overflow-y-auto hide-scrollbar bg-white">
        {activeTab === 'recipes' ? (
          <div className="pb-32">
            <header className="px-8 pt-16 pb-8">
              <div className="flex justify-between items-start mb-10">
                <h1 className="text-4xl font-serif font-bold text-gray-900">Kitchen Vault</h1>
                <div className="w-12 h-12 rounded-2xl bg-gray-900 shadow-xl overflow-hidden border border-white/20">
                  <img src="https://i.pravatar.cc/150?u=chef" className="w-full h-full object-cover" alt="Avatar" />
                </div>
              </div>
              <div className="relative w-full rounded-[40px] overflow-hidden shadow-mystic group">
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
                <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=2000" className="w-full aspect-[16/9] object-cover transition-transform duration-1000 group-hover:scale-105" alt="Chef" />
                <div className="absolute bottom-8 left-8 z-20">
                  <span className="px-4 py-1 text-white text-[10px] font-black uppercase tracking-widest rounded-lg mb-3 inline-block bg-[#5C5C78] shadow-lg">Trending Now</span>
                  <h2 className="text-2xl font-serif text-white font-bold leading-tight">Mastering the Art of<br/>Asian Fusion</h2>
                </div>
              </div>
            </header>

            <main className="px-8 mt-12">
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-8">Featured Recipes</h3>
              <div className="grid grid-cols-2 gap-4">
                {RECIPES.map((recipe, index) => {
                  const classification = getRecipeClassification(recipe.name);
                  return (
                    <div key={recipe.id} onClick={() => setSelectedIndex(index)} className="group relative bg-white rounded-[32px] p-3 flex flex-col shadow-sm border border-gray-50 active:scale-[0.98] transition-all hover:shadow-mystic cursor-pointer">
                      <StickerTag classification={classification} className="-top-1 -right-1" />
                      <div className="w-full aspect-square rounded-[24px] overflow-hidden shadow-lg mb-4">
                        <img src={recipe.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={recipe.name} />
                      </div>
                      <h4 className="text-base font-serif font-bold text-gray-900 mb-1.5 leading-tight line-clamp-2 px-1">{recipe.name}</h4>
                    </div>
                  );
                })}
              </div>
            </main>
          </div>
        ) : (
          <div className="px-8 pt-16 pb-32">
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Today's Menu</h1>
            <p className="text-sm text-gray-400 font-medium mb-12">Curate your dining experience.</p>
            <div className="bg-white rounded-[40px] p-10 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={PRIMARY_COLOR} strokeWidth="2">
                  <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
                  <path d="M7 2v20"/>
                  <path d="M21 15V2 v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900">Empty Vault</h3>
              <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-xl active:scale-95 transition-all">Generate Suggestion</button>
            </div>
          </div>
        )}
      </div>

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-2xl border border-white/60 p-1 rounded-full shadow-mystic z-[150] w-[calc(100%-4rem)] max-w-[320px]">
        <div className="relative flex items-center h-14">
          <div 
            className="absolute top-0 bottom-0 transition-all duration-300 ease-out bg-gray-100/90 rounded-full z-0"
            style={{ 
              width: '50%',
              left: activeTab === 'recipes' ? '0%' : '50%',
            }}
          />
          
          <button 
            onClick={navToRecipes}
            className="flex-1 flex flex-col items-center justify-center relative z-10"
          >
            <RecipeIcon active={activeTab === 'recipes'} />
            <span className={`text-[9px] font-black uppercase tracking-tighter ${activeTab === 'recipes' ? 'text-[#5C5C78]' : 'text-gray-400'}`}>Recipes</span>
          </button>
          
          <button 
            onClick={navToMenu}
            className="flex-1 flex flex-col items-center justify-center relative z-10"
          >
            <MenuIcon active={activeTab === 'menu'} />
            <span className={`text-[9px] font-black uppercase tracking-tighter ${activeTab === 'menu' ? 'text-[#5C5C78]' : 'text-gray-400'}`}>Menu</span>
          </button>
        </div>
      </nav>

      {selectedIndex !== null && (
        <RecipeDetail 
          selectedIndex={selectedIndex} 
          onClose={() => setSelectedIndex(null)} 
          checkedIngredients={checkedIngredients} 
          onToggleIngredient={handleToggle} 
        />
      )}
    </div>
  );
}
