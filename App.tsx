
import { Recipe } from './types';
import React, { useState, useEffect, useRef, useMemo, useCallback, useDeferredValue } from 'react';
import { RECIPES } from './constants';

const CORRECT_PASSWORD = '333';
const PRIMARY_COLOR = '#5C5C78';

// --- 重要設定區 ---
const GAS_URL = 'https://script.google.com/macros/s/AKfycbyDnPhLTs7nopL5NbL7L4MdB3wfXvZQzYzx8xMDDXn2d9YsiEKrW2IML0xHeMp538A-bg/exec';
const GOOGLE_CLIENT_ID = '575375621352-it9ujsjbnvqrs31ic8q7ehufkvuin0ma.apps.googleusercontent.com';

// --- Custom Hook: useMenuCloudSync ---
/**
 * 處理與 Google Sheets (via GAS) 的資料同步
 */
const useMenuCloudSync = (favorites: string[], googleUser: any, onAuthNeeded: () => void) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<string | null>(localStorage.getItem('kitchen_last_sync'));

  const syncNow = useCallback(async () => {
    const token = sessionStorage.getItem('google_token');
    if (!token) {
      onAuthNeeded();
      return;
    }

    const list = RECIPES.filter(r => favorites.includes(r.id));
    if (list.length === 0) {
      setError("清單為空");
      return;
    }

    setIsSyncing(true);
    setError(null);

    try {
      const payload = {
        userEmail: googleUser?.email || "admin@kitchenvault.com",
        recipes: list.map(r => ({ id: r.id, name: r.name, category: r.category, date: r.date }))
      };

      // 關鍵：使用 text/plain 繞過 GAS 的 CORS Preflight 限制
      const response = await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...payload, token })
      });

      // 由於 no-cors 無法取得 response body，我們假設成功發送即為初步成功
      const now = new Date().toLocaleTimeString();
      setLastSynced(now);
      localStorage.setItem('kitchen_last_sync', now);
      return true;
    } catch (err: any) {
      setError(err.message || "同步失敗");
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [favorites, googleUser, onAuthNeeded]);

  return { isSyncing, error, lastSynced, syncNow, setError };
};

// --- UI Components ---
const BackIcon = React.memo(() => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>);
const DateIcon = React.memo(({ className = "" }: { className?: string }) => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
));
const RecipeIcon = React.memo(({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? PRIMARY_COLOR : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    {active && <line x1="8" x2="16" y1="6" y2="6" strokeWidth="1.5" />}{active && <line x1="8" x2="16" y1="10" y2="10" strokeWidth="1.5" />}
  </svg>
));
const MenuIcon = React.memo(({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? PRIMARY_COLOR : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" />
    <path d="M3 6h.01" strokeWidth="3" /><path d="M3 12h.01" strokeWidth="3" /><path d="M3 18h.01" strokeWidth="3" />
  </svg>
));
const SearchIcon = React.memo(() => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.35-4.35"></path></svg>);
const CloseIcon = React.memo(() => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const ResetIcon = React.memo(() => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>);
const CloudSyncIcon = React.memo(({ syncing }: { syncing: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={syncing ? "animate-spin" : ""}>
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    {!syncing && <path d="m12 13-3-3m0 0 3-3m-3 3h8" />}
  </svg>
));
const GoogleIcon = React.memo(() => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09c1.97 3.92 6.02 6.62 10.71 6.62z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.97 11.97 0 0 0 0 10.75l3.98-3.08z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
  </svg>
));
const CollectionIcon = React.memo(({ active, className = "" }: { active: boolean, className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`}><img src={active ? "Bookmark_on.svg" : "Bookmark_off.svg"} className="w-full h-full object-contain opacity-100" alt="Bookmark" /></div>
));
const BasketIcon = React.memo(({ active }: { active: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "3" : "2"}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
));
const ChefHatIcon = React.memo(({ active }: { active: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "3" : "2"}><path d="M6 13.8V21h12v-7.2" /><path d="M9 21v-3" /><path d="M15 21v-3" /><path d="M12 3c-4.4 0-8 3.6-8 8 0 .8.2 1.6.5 2.3.4.9 1 1.7 1.8 2.3l1.7-1.7V5h8v8.9l1.7 1.7c.8-.6 1.4-1.4 1.8-2.3.3-.7.5-1.5.5-2.3 0-4.4-3.6-8-8-8Z" /></svg>
));
const YouTubeIcon = React.memo(() => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>);
const SecretStarIcon = React.memo(() => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#5C5C78]"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>);

// --- Helpers ---
const getRecipeIcon = (name: string, category: string, className?: string) => {
  const finalClass = className || "w-20 h-20 object-contain";
  switch (category) {
    case '中式甜點': return <img src="Chinese_desserts.svg" className={finalClass} />;
    case '西式甜點': return <img src="cake.svg" className={finalClass} />;
    case '自製醬餡': return <img src="jam.svg" className={finalClass} />;
    case '飲品': return <img src="cocktails.svg" className={finalClass} />; 
    case '豆腐料理': return <img src="tofu.svg" className={finalClass} />;
    case '麵類料理': return <img src="noodle.svg" className={finalClass} />;
    case '飯類料理': return <img src="rice.svg" className={finalClass} />;
    case '肉類料理': return <img src="meat.svg" className={finalClass} />;
    case '海鮮料理': return <img src="seafood.svg" className={finalClass} />;
    case '蛋類料理': return <img src="egg.svg" className={finalClass} />;
    case '蔬食料理': return <img src="vegetable.svg" className={finalClass} />;
    case '湯品鍋物': return <img src="soup.svg" className={finalClass} />;
    default: return <img src="soup.svg" className={finalClass} />;
  }
};

const getCategoryMiniIcon = (category: string) => {
  const commonProps = { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "transition-all duration-300 flex-shrink-0" } as const;
  switch (category) {
    case '全部': return <svg {...commonProps}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
    case '肉類料理': return <svg {...commonProps}><path d="M12 2c3.5 0 9 2.5 9 10s-5.5 10-9 10-9-2.5-9-10 5.5-10 9-10z" /><path d="M12 22s2-4 2-10-2-10-2-10" /></svg>;
    case '海鮮料理': return <svg {...commonProps}><path d="M2 12s5-7 10-7 10 7 10 7-5 7-10 7-10-7-10-7Z" /><path d="M12 5v14" /></svg>;
    case '蔬食料理': return <svg {...commonProps}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 21 2c-1 5-1.5 5.5-1 11.2A7 7 0 0 1 11 20Z" /><path d="M11 13v7" /></svg>;
    case '湯品鍋物': return <svg {...commonProps}><path d="M3 12h18" /><path d="M6 12c0 4.4 3.6 8 8 8s8-3.6 8-8" /><path d="M9 7c0-2 1-3 3-3" /><path d="M15 7c0-2 1-3 3-3" /></svg>;
    case '蛋類料理': return <svg {...commonProps}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /></svg>;
    case '豆腐料理': return <svg {...commonProps}><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 4v16" /><path d="M15 4v16" /><path d="M4 9h16" /><path d="M4 15h16" /></svg>;
    case '麵類料理': return <svg {...commonProps}><path d="M22 12s-3-4-10-4-10 4-10 4" /><path d="M2 12c0 5.5 4.5 10 10 10s10-4.5 10-10" /><path d="M7 8V4" /><path d="M12 8V4" /><path d="M17 8V4" /></svg>;
    case '飯類料理': return <svg {...commonProps}><path d="M3 12h18" /><path d="M3 12c0 5 4 9 9 9s9-4 9-9" /><path d="M12 3c3 0 6 3 6 6H6c0-3 3-6 6-6Z" /></svg>;
    case '中式甜點': return <svg {...commonProps}><circle cx="12" cy="12" r="10" /><path d="M12 2v20" /><path d="M2 12h20" /></svg>;
    case '西式甜點': return <svg {...commonProps}><path d="m20 10-8-8-8 8v10h16V10Z" /><path d="M4 14h16" /></svg>;
    case '自製醬餡': return <svg {...commonProps}><path d="M6 18h12v3a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-3Z" /><path d="M8 18v-8h8v8" /><path d="M7 6h10" /></svg>;
    case '飲品': return <svg {...commonProps}><path d="M18 2h-3L7 11.1c-1.1 1.2-1.1 3 0 4.1L12.9 21c1.2 1.1 3 1.1 4.1 0L22 16" /><path d="m11 15 4 4" /><path d="m15 11 4 4" /></svg>;
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

const CATEGORIES = ['全部', '肉類料理', '海鮮料理', '蔬食料理', '湯品鍋物', '蛋類料理', '豆腐料理', '麵類料理', '飯類料理', '中式甜點', '西式甜點', '自製醬餡', '飲品'];

const StickerTag = React.memo(({ label, color, className }: { label: string, color: string, className?: string }) => (
  <div className={`absolute z-[110] px-3 py-1.5 text-[10px] font-sans font-bold uppercase tracking-fine shadow-[2px_2px_8px_-1px_rgba(0,0,0,0.1)] rotate-[4deg] origin-center pointer-events-none ${color} ${className}`}>
    {label}<div className="absolute bottom-0 right-0 w-2 h-2 bg-black/5" />
  </div>
));

const RecipeDetail: React.FC<{ 
  selectedIndex: number; onClose: () => void; checkedIngredients: Record<string, boolean>; onToggleIngredient: (id: string) => void; onResetIngredients: (ids: string[]) => void; recipes: Recipe[]; favorites: string[]; onToggleFavorite: (id: string) => void; searchQuery?: string;
}> = ({ selectedIndex, onClose, checkedIngredients, onToggleIngredient, onResetIngredients, recipes, favorites, onToggleFavorite, searchQuery }) => {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps'>('ingredients');
  const [currentCardIndex, setCurrentCardIndex] = useState(selectedIndex);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const recipe = recipes[currentCardIndex];
    if (searchQuery && recipe) {
      const q = searchQuery.toLowerCase().trim();
      if (!recipe.ingredients.some(i => i.name.toLowerCase().includes(q)) && (recipe.steps.some(s => s.toLowerCase().includes(q)) || (recipe.tips && recipe.tips.toLowerCase().includes(q)))) {
        setActiveTab('steps');
      }
    }
  }, [searchQuery, currentCardIndex, recipes]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const card = container.children[selectedIndex] as HTMLElement;
      if (card) { container.scrollTo({ left: card.offsetLeft, behavior: 'auto' }); setCurrentCardIndex(selectedIndex); }
    }
  }, [selectedIndex]);

  return (
    <div className="fixed inset-0 z-[600] bg-[#FDFBF7] overflow-hidden font-sans max-w-md mx-auto shadow-2xl">
      <div className="h-full relative flex flex-col bg-white">
        <button onClick={onClose} className="fixed top-8 left-6 z-[650] p-3 bg-white/95 backdrop-blur-md rounded-2xl text-gray-900 shadow-xl active:scale-90 transition-transform"><BackIcon /></button>
        <div ref={scrollContainerRef} onScroll={() => { if (scrollContainerRef.current) { const i = Math.round(scrollContainerRef.current.scrollLeft / scrollContainerRef.current.clientWidth); if (i !== currentCardIndex) setCurrentCardIndex(i); } }} className="flex-1 flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory hide-scrollbar flex-nowrap pb-20">
          {recipes.map((recipe) => {
            const isFavorite = favorites.includes(recipe.id);
            return (
              <div key={recipe.id} className="w-full h-full flex-shrink-0 snap-center flex flex-col">
                <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col pb-44">
                  <div className="relative w-full aspect-[4/3] flex-shrink-0 bg-gray-50 flex items-center justify-center border-b border-gray-100">
                    <div className="relative transform scale-[1.2] flex items-center justify-center">{getRecipeIcon(recipe.name, recipe.category)}</div>
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-20" />
                    <StickerTag label={recipe.category} color={getRecipeColor(recipe.category)} className="bottom-12 right-6" />
                  </div>
                  <div className="px-8 pb-12 -mt-16 relative z-[80]">
                    <div className="bg-white rounded-[40px] p-2">
                      <div className="flex justify-between items-start mb-1 gap-4">
                        <h1 className="text-3xl font-serif font-bold text-gray-900 leading-tight flex-1">{recipe.name}</h1>
                        <button onClick={() => onToggleFavorite(recipe.id)} className="mt-1 p-1 active:scale-90 transition-all bg-gray-50 rounded-2xl border border-white shadow-sm overflow-hidden"><CollectionIcon active={isFavorite} className="w-14 h-14" /></button>
                      </div>
                      <div className="flex items-center gap-2 mb-6"><span className="text-[10px] font-sans font-bold uppercase tracking-fine text-[#5C5C78]">Recipe Date</span><div className="flex items-center gap-1.5 text-gray-400"><DateIcon className="opacity-60 flex-shrink-0" /><span className="text-[12px] font-sans font-bold tracking-tight-info">{recipe.date}</span></div></div>
                      <p className="text-gray-500 text-[13px] leading-relaxed mb-8 border-l-2 border-gray-100 pl-4 whitespace-pre-wrap font-sans">{recipe.description}</p>
                      <div className="relative flex gap-1 p-1.5 bg-gray-100/60 backdrop-blur-sm rounded-[24px] mb-8 border border-gray-200/50">
                        <div className="absolute h-[calc(100%-12px)] w-[calc(50%-6px)] bg-white shadow-md rounded-[18px] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-0 border-b-2 border-gray-50" style={{ transform: `translateX(${activeTab === 'ingredients' ? '0' : '100%'})` }} />
                        <button onClick={() => setActiveTab('ingredients')} className={`relative z-10 flex-1 py-3.5 flex items-center justify-center gap-2.5 font-sans font-bold text-[10px] tracking-fine transition-all duration-300 ${activeTab === 'ingredients' ? 'text-gray-900' : 'text-gray-400'}`}><BasketIcon active={activeTab === 'ingredients'} /> ITEMS ({recipe.ingredients.length})</button>
                        <button onClick={() => setActiveTab('steps')} className={`relative z-10 flex-1 py-3.5 flex items-center justify-center gap-2.5 font-sans font-bold text-[10px] tracking-fine transition-all duration-300 ${activeTab === 'steps' ? 'text-gray-900' : 'text-gray-400'}`}><ChefHatIcon active={activeTab === 'steps'} /> STEPS ({recipe.steps.length})</button>
                      </div>
                      <div className="space-y-4">
                        {activeTab === 'ingredients' ? (
                          <>
                            <div className={`flex justify-end transition-all duration-500 ease-out overflow-hidden ${recipe.ingredients.some(i => checkedIngredients[i.id]) ? 'max-h-12 opacity-100 mb-2' : 'max-h-0 opacity-0 pointer-events-none'}`}><button onClick={(e) => { e.stopPropagation(); onResetIngredients(recipe.ingredients.map(i => i.id)); }} className="flex items-center gap-2 px-4 py-2 bg-[#5C5C78]/5 hover:bg-[#5C5C78]/10 rounded-xl text-[9px] font-sans font-bold uppercase tracking-fine text-[#5C5C78] active:scale-95 transition-all group"><span className="group-hover:rotate-[-45deg] transition-transform duration-300"><ResetIcon /></span>Reset List</button></div>
                            {recipe.ingredients.map((ing) => (
                              <div key={ing.id} onClick={() => onToggleIngredient(ing.id)} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/60 border border-transparent active:border-gray-200 transition-all cursor-pointer">
                                <div className="flex items-center gap-4"><div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${checkedIngredients[ing.id] ? 'bg-[#5C5C78] border-[#5C5C78]' : 'border-gray-200'}`}>{checkedIngredients[ing.id] && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>}</div><span className={`text-sm font-semibold ${checkedIngredients[ing.id] ? 'text-gray-300 line-through' : 'text-gray-800'}`}>{ing.name}</span></div><span className="text-[11px] font-sans font-bold text-gray-400 uppercase tracking-fine">{ing.amount}</span>
                              </div>
                            ))}
                          </>
                        ) : (
                          <div className="space-y-6 pt-4">
                            {recipe.youtubeUrl && <a href={recipe.youtubeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-2.5 mb-4 bg-[#FF0000]/5 border border-[#FF0000]/10 rounded-xl text-[#FF0000] active:scale-[0.98] transition-all"><YouTubeIcon /><span className="text-[10px] font-sans font-bold uppercase tracking-fine">Watch Video Guide</span></a>}
                            {recipe.steps.map((step, i) => (<div key={i} className="flex gap-4 items-start"><div className="w-6 h-6 rounded-lg bg-[#5C5C78] text-white flex items-center justify-center text-[10px] font-sans font-bold flex-shrink-0 mt-0.5">{i + 1}</div><p className="text-gray-600 text-[14px] font-medium leading-relaxed">{step}</p></div>))}
                            {recipe.tips && (<div className="mt-36 relative"><div className="absolute -top-4 left-6 z-20"><div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#EFE9E4] rounded-lg shadow-sm"><SecretStarIcon /><span className="text-[#5C5C78] text-[9px] font-sans font-bold tracking-fine uppercase">Secret Tip</span></div></div><div className="bg-gradient-to-br from-[#F9F7F2] to-[#FDFBF7] rounded-3xl p-8 pt-12 relative overflow-hidden group shadow-[0_10px_40px_rgba(0,0,0,0.03)]"><div className="absolute -bottom-10 -right-10 opacity-[0.05] grayscale scale-[2.5] rotate-[-15deg] pointer-events-none transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-[-20deg]">{getRecipeIcon(recipe.name, recipe.category, "w-32 h-32 object-contain")}</div><p className="text-[#4A4A4A] text-[13px] font-semibold leading-[1.8] tracking-tight whitespace-pre-wrap relative z-10">{recipe.tips}</p></div></div>)}
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
  useEffect(() => { if (pin.length === 3) { if (pin === CORRECT_PASSWORD) onLogin(); else { setError(true); setTimeout(() => { setError(false); setPin(''); }, 600); } } }, [pin, onLogin]);
  return (
    <div className="h-[100dvh] bg-[#FDFBF7] flex flex-col items-center justify-between py-24 px-8 font-sans max-w-md mx-auto relative overflow-hidden">
      <div className="flex flex-col items-center text-center"><div className="mb-8 drop-shadow-2xl"><img src="chef_blue.svg" className="w-24 h-24 object-contain" alt="Logo" /></div><h1 className="text-4xl font-display font-bold text-gray-900 mb-3">Kitchen Vault</h1><p className="text-[10px] text-gray-400 font-sans font-bold uppercase tracking-fine">The Black Book</p></div>
      <div className="flex-1 flex items-center justify-center w-full">
        <div className={`grid grid-cols-3 gap-6 w-full max-w-[280px] ${error ? 'animate-shake' : ''}`}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((k, i) => (
            <button key={i} disabled={!k} onClick={() => k === '⌫' ? setPin(p => p.slice(0, -1)) : setPin(p => p + k)} className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-xl font-sans font-bold transition-all active:scale-90 ${!k ? 'opacity-0' : `bg-white shadow-sm border border-gray-100 ${error ? 'text-red-500' : 'text-gray-900'}`}`}>{k}</button>
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  
  const [googleUser, setGoogleUser] = useState<{ email?: string; name?: string } | null>(null);
  const [isGisReady, setIsGisReady] = useState(false);
  const tokenClientRef = useRef<any>(null);

  // 初始化自定義同步 Hook
  const { isSyncing, lastSynced, syncNow, setError: setSyncError } = useMenuCloudSync(
    favorites, 
    googleUser, 
    () => handleGoogleLogin()
  );

  // Initialize GIS
  const initGis = useCallback(() => {
    const gsiAvailable = !!(window as any).google?.accounts?.oauth2;
    if (gsiAvailable) {
      setIsGisReady(true);
      if (!tokenClientRef.current) {
        try {
          tokenClientRef.current = (window as any).google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
            callback: async (response: any) => {
              if (response.access_token) {
                try {
                  const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${response.access_token}` }
                  }).then(res => res.json());
                  setGoogleUser({ email: userInfo.email, name: userInfo.name });
                  sessionStorage.setItem('google_token', response.access_token);
                  // 授權成功後自動觸發一次同步
                  setTimeout(() => syncNow(), 500);
                } catch (e) {
                  console.error("Failed to fetch user info", e);
                }
              }
            },
            error_callback: (err: any) => {
              // 修正：處理使用者取消 Popup 的情況
              if (err.type === 'popup_closed_by_user') {
                console.log("使用者關閉了授權視窗");
                return;
              }
              console.error("GIS Error:", err);
            }
          });
        } catch (e) {
          console.error("GIS Init failed:", e);
        }
      }
      return true;
    }
    return false;
  }, [syncNow]);

  useEffect(() => {
    if (sessionStorage.getItem('kitchen_auth') === 'true') setIsAuth(true);
    const savedChecked = localStorage.getItem('kitchen_checked_v8');
    if (savedChecked) setCheckedIngredients(JSON.parse(savedChecked));
    const savedFavorites = localStorage.getItem('kitchen_favorites_v11');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));

    const interval = setInterval(() => {
      if (initGis()) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [initGis]);

  const handleGoogleLogin = useCallback(() => {
    if (tokenClientRef.current) {
      try {
        tokenClientRef.current.requestAccessToken({ prompt: 'consent' });
      } catch (e) {
        alert("登入視窗開啟失敗，請檢查瀏覽器設定。");
      }
    } else {
      initGis();
    }
  }, [initGis]);

  const filteredRecipes = useMemo(() => {
    const q = deferredSearchQuery.toLowerCase().trim();
    if (isSearchOpen && q) {
      return RECIPES.filter(r => r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
    }
    return selectedCategory === '全部' ? RECIPES : RECIPES.filter(r => r.category === selectedCategory);
  }, [selectedCategory, deferredSearchQuery, isSearchOpen]);

  const favoriteRecipes = useMemo(() => RECIPES.filter(r => favorites.includes(r.id)), [favorites]);

  if (!isAuth) return <LoginView onLogin={() => { setIsAuth(true); sessionStorage.setItem('kitchen_auth', 'true'); }} />;

  return (
    <div className="h-[100dvh] bg-[#1A1A1A] font-sans max-w-md mx-auto relative flex flex-col shadow-2xl overflow-hidden">
      <div className="flex-1 bg-[#FDFBF7] relative flex flex-col h-full overflow-hidden">
        {/* Sync Status Indicator Overlay */}
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[1000] px-6 py-3 rounded-full backdrop-blur-md border shadow-xl transition-all duration-500 transform ${lastSynced && !isSyncing ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'} bg-green-50/90 border-green-200 text-green-700`}>
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span className="text-[11px] font-sans font-bold uppercase tracking-fine">Synced {lastSynced}</span>
          </div>
        </div>

        {/* 搜尋列 */}
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[900] w-[calc(100%-2rem)] max-w-[360px] transition-all duration-500 transform ${isSearchOpen ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-20 opacity-0 scale-95 pointer-events-none'}`}>
          <div className="relative group">
            <div className="absolute inset-0 bg-white/95 backdrop-blur-[2px] rounded-full border border-gray-200/50 shadow-glass pointer-events-none" />
            <div className="relative flex items-center px-6 py-4 gap-3">
              <span className="text-gray-900 flex items-center justify-center"><SearchIcon /></span>
              <input type="text" placeholder="Search globally..." className="flex-1 bg-transparent border-none outline-none text-[14px] font-sans font-bold text-gray-900 placeholder-gray-400 tracking-fine" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <button type="button" onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="text-gray-400 hover:text-gray-900"><CloseIcon /></button>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex-shrink-0 z-[100] bg-transparent px-8 pt-10 pb-4">
          <div className="flex justify-between items-end mb-8">
            <h1 className="text-[36px] font-display font-bold text-gray-900 leading-none">Kitchen Vault</h1>
            <div className="flex items-center gap-3">
               {googleUser && (
                 <div className="flex flex-col items-end">
                   <span className="text-[10px] font-bold text-[#5C5C78] opacity-60 uppercase">Cloud Active</span>
                   <span className="text-[11px] font-bold text-gray-900">{googleUser.name}</span>
                 </div>
               )}
               <div className="relative w-14 h-14 rounded-[20px] bg-white border border-gray-100 shadow-sm flex items-center justify-center">
                 <img src="isa_icon.svg" className="w-9 h-9 opacity-80" style={{ filter: 'invert(37%) sepia(13%) saturate(1004%) hue-rotate(201deg) brightness(95%) contrast(87%)' }} />
               </div>
            </div>
          </div>
          
          {activeTab === 'recipes' ? (
            <div className="flex items-center h-12 overflow-x-auto hide-scrollbar gap-1">
              {CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-5 h-9 rounded-full flex items-center justify-center gap-2 text-[11px] font-sans font-bold tracking-tight transition-all duration-500 whitespace-nowrap ${selectedCategory === cat ? 'bg-white shadow-sm text-[#5C5C78]' : 'text-gray-400 hover:text-gray-600'}`}>
                  <div className="w-4 h-4 flex items-center justify-center">{getCategoryMiniIcon(cat)}</div><span>{cat}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-between p-2 bg-white/95 border border-gray-200/50 rounded-[20px] shadow-sm">
              <div className="flex items-center gap-3 pl-3">
                <div className="p-1.5 bg-[#5C5C78]/10 rounded-lg text-[#5C5C78]"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></div>
                <div className="flex flex-col"><span className="text-[10px] font-sans font-bold uppercase tracking-fine text-gray-400 leading-none mb-1">Selection</span><span className="text-[13px] font-sans font-bold text-[#5C5C78]">{favoriteRecipes.length} <span className="text-[10px] opacity-40">ITEMS</span></span></div>
              </div>
              <div className="flex items-center gap-2">
                {!googleUser ? (
                  <button 
                    onClick={handleGoogleLogin} 
                    className={`flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-[14px] text-[10px] font-sans font-bold uppercase tracking-fine text-gray-900 active:scale-95 transition-all ${!isGisReady ? 'opacity-50 grayscale pointer-events-none' : ''}`}
                  >
                    <GoogleIcon /> Login
                  </button>
                ) : (
                  <button onClick={() => syncNow()} disabled={isSyncing} className={`flex items-center gap-2 px-4 py-2.5 bg-[#5C5C78]/10 rounded-[14px] text-[10px] font-sans font-bold uppercase tracking-fine text-[#5C5C78] active:scale-95 transition-all ${isSyncing ? 'opacity-70 pointer-events-none' : ''}`}>
                    <CloudSyncIcon syncing={isSyncing} /> {isSyncing ? 'Syncing' : 'Sync'}
                  </button>
                )}
                <button onClick={() => setFavorites([])} className="flex items-center gap-2 px-5 py-2.5 bg-gray-100/50 rounded-[14px] text-[10px] font-sans font-bold uppercase tracking-fine text-gray-400 active:scale-95 transition-all"><ResetIcon /> Reset</button>
              </div>
            </div>
          )}
        </div>
        
        <div id="recipes-container" className="flex-1 overflow-y-auto hide-scrollbar pt-2 pb-44">
          <main className="px-8 min-h-full select-none">
            <div className="grid grid-cols-2 gap-x-4 gap-y-12">
              {(activeTab === 'recipes' ? filteredRecipes : favoriteRecipes).map((recipe, idx) => (
                <div key={recipe.id} onClick={() => setSelectedIndex(idx)} className="group relative bg-white rounded-[32px] p-4 flex flex-col shadow-sm border border-gray-100 active:scale-[0.96] transition-all hover:shadow-mystic cursor-pointer overflow-visible">
                  <button onClick={(e) => { e.stopPropagation(); setFavorites(prev => prev.includes(recipe.id) ? prev.filter(f => f !== recipe.id) : [...prev, recipe.id]); }} className="absolute -top-3 -left-3 z-[120] active:scale-90 transition-transform"><CollectionIcon active={favorites.includes(recipe.id)} className="w-12 h-12" /></button>
                  <div className="w-full aspect-square rounded-[24px] mb-4 flex items-center justify-center relative bg-gray-50/50">
                    <div className="transition-transform duration-700 group-hover:scale-110 flex items-center justify-center">{getRecipeIcon(recipe.name, recipe.category)}</div>
                    <StickerTag label={recipe.category} color={getRecipeColor(recipe.category)} className="top-2 -right-4" />
                  </div>
                  <h4 className="text-[15px] font-serif font-bold text-gray-900 px-1 leading-tight line-clamp-2 mb-1">{recipe.name}</h4>
                  <div className="flex items-center gap-1.5 px-1 mt-1 text-gray-400"><DateIcon className="opacity-60 flex-shrink-0" /><span className="text-[12px] font-sans font-bold tracking-tight-info">{recipe.date}</span></div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      <div className="fixed bottom-28 right-6 z-[800]"><button onClick={() => setIsSearchOpen(!isSearchOpen)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 active:scale-90 shadow-glass border border-gray-200/50 backdrop-blur-[2px] ${isSearchOpen ? 'bg-[#5C5C78] text-white rotate-90' : 'bg-white/95 text-gray-900'}`}>{isSearchOpen ? <CloseIcon /> : <SearchIcon />}</button></div>

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-[2px] border border-gray-200/50 p-1 rounded-full shadow-mystic z-[700] w-[calc(100%-4rem)] max-w-[320px]">
        <div className="relative flex items-center h-14">
          <div className="absolute top-1/2 -translate-y-1/2 w-14 h-14 bg-gray-100/90 backdrop-blur-sm rounded-full border border-white/60 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] z-0 shadow-sm" style={{ left: activeTab === 'recipes' ? '25%' : '75%', transform: 'translate(-50%, -50%)' }} />
          <button onClick={() => setActiveTab('recipes')} className="flex-1 h-full flex flex-col items-center justify-center relative z-10 outline-none active:scale-90 transition-transform"><RecipeIcon active={activeTab === 'recipes'} /><span className={`text-[9px] font-sans font-bold uppercase mt-1 tracking-fine ${activeTab === 'recipes' ? 'text-[#5C5C78]' : 'text-gray-400'}`}>Recipes</span></button>
          <button onClick={() => setActiveTab('menu')} className="flex-1 h-full flex flex-col items-center justify-center relative z-10 outline-none active:scale-90 transition-transform"><MenuIcon active={activeTab === 'menu'} /><span className={`text-[9px] font-sans font-bold uppercase mt-1 tracking-fine ${activeTab === 'menu' ? 'text-[#5C5C78]' : 'text-gray-400'}`}>Menu</span></button>
        </div>
      </nav>

      {selectedIndex !== null && <RecipeDetail selectedIndex={selectedIndex} onClose={() => setSelectedIndex(null)} checkedIngredients={checkedIngredients} onToggleIngredient={(id) => setCheckedIngredients(p => ({ ...p, [id]: !p[id] }))} onResetIngredients={(ids) => setCheckedIngredients(p => { const n = { ...p }; ids.forEach(i => delete n[i]); return n; })} recipes={activeTab === 'recipes' ? filteredRecipes : favoriteRecipes} favorites={favorites} onToggleFavorite={(id) => setFavorites(p => p.includes(id) ? p.filter(f => f !== id) : [...p, id])} searchQuery={deferredSearchQuery} />}
    </div>
  );
}
