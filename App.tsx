
import React, { useState, useEffect } from 'react';
import { RECIPES } from './constants';
import { Recipe } from './types';

const CORRECT_PASSWORD = '333';

// --- Icons ---
const BackIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>;
const RecipeIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#F27405" : "#9CA3AF"} strokeWidth="2">
    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
    <path d="M12 7v10M7 12h10" />
  </svg>
);
const MenuIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#F27405" : "#9CA3AF"} strokeWidth="2">
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

// --- Components ---

const RecipeDetail: React.FC<{ 
  recipe: Recipe; 
  onClose: () => void;
  checkedIngredients: Record<string, boolean>;
  onToggleIngredient: (id: string) => void;
}> = ({ recipe, onClose, checkedIngredients, onToggleIngredient }) => {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps'>('ingredients');

  return (
    <div className="fixed inset-0 z-50 bg-[#FDFBF7] animate-in slide-in-from-bottom duration-500 overflow-y-auto hide-scrollbar font-sans">
      <div className="relative h-[45vh] w-full overflow-hidden">
        <img src={recipe.image} className="w-full h-full object-cover" alt={recipe.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-transparent to-black/20" />
        <button onClick={onClose} className="absolute top-12 left-6 p-3 bg-white/90 backdrop-blur-md rounded-2xl text-gray-900 shadow-xl active:scale-90 transition-transform">
          <BackIcon />
        </button>
      </div>

      <div className="px-8 -mt-16 relative z-10 pb-20">
        <div className="bg-white rounded-[40px] p-8 shadow-2xl border border-gray-100">
          <div className="mb-6">
            <span className="text-[10px] font-black text-[#F27405] uppercase tracking-[0.25em] mb-2 block">{recipe.category}</span>
            <h1 className="text-4xl font-serif font-bold text-gray-900 leading-tight mb-2">{recipe.name}</h1>
          </div>

          <p className="text-gray-500 text-sm leading-relaxed mb-8 border-l-2 border-gray-100 pl-4">
            {recipe.description}
          </p>

          <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl mb-8">
            <button 
              onClick={() => setActiveTab('ingredients')}
              className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${activeTab === 'ingredients' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}
            >
              ITEMS ({recipe.ingredients.length})
            </button>
            <button 
              onClick={() => setActiveTab('steps')}
              className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${activeTab === 'steps' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}
            >
              STEPS ({recipe.steps.length})
            </button>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {activeTab === 'ingredients' ? (
              <div className="space-y-2.5">
                {recipe.ingredients.map((ing) => {
                  const isChecked = checkedIngredients[ing.id];
                  return (
                    <div 
                      key={ing.id} 
                      onClick={() => onToggleIngredient(ing.id)}
                      className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/40 border border-transparent active:border-gray-200 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isChecked ? 'bg-[#F27405] border-[#F27405]' : 'border-gray-200'}`}>
                          {isChecked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                        </div>
                        <span className={`text-sm font-semibold ${isChecked ? 'text-gray-300 line-through' : 'text-gray-800'}`}>{ing.name}</span>
                      </div>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider opacity-80">{ing.amount}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-5">
                {recipe.steps.map((step, i) => (
                  <div key={i} className="flex gap-4 items-start p-1 transition-colors">
                    <div className="w-[22px] h-[22px] rounded-md bg-gray-900 text-white flex items-center justify-center text-[9px] font-black flex-shrink-0 shadow-lg mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-gray-600 text-[13px] font-medium leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MenuView: React.FC = () => {
  return (
    <div className="px-8 pt-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Today's Menu</h1>
        <p className="text-sm text-gray-400 font-medium">Curate your dining experience for today.</p>
      </div>

      <div className="bg-white rounded-[40px] p-10 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F27405" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
        </div>
        <div>
          <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Empty Vault</h3>
          <p className="text-sm text-gray-400 max-w-[200px] leading-relaxed">You haven't planned any secret recipes for today yet.</p>
        </div>
        <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
          Generate Suggestion
        </button>
      </div>

      <div className="mt-12 space-y-4">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Saved Planner Items</h4>
        <div className="p-6 bg-gray-100/50 rounded-3xl flex items-center gap-4 opacity-50 grayscale">
          <div className="w-12 h-12 bg-white rounded-xl"></div>
          <div className="h-2 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

const LoginView: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleVerify = () => {
    if (pin === CORRECT_PASSWORD) {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => { setError(false); setPin(''); }, 600);
    }
  };

  useEffect(() => {
    if (pin.length === 3) handleVerify();
  }, [pin]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-between py-24 px-8 font-sans">
      <div className="flex flex-col items-center text-center">
        <div className="mb-8 drop-shadow-2xl animate-in fade-in zoom-in duration-1000">
          <img src="public/chef_2.svg" className="w-24 h-24 object-contain" alt="Kitchen Vault Chef Icon" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-3">Kitchen Vault</h1>
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em]">The Black Book</p>
      </div>

      <div className={`flex gap-4 justify-center py-10 ${error ? 'animate-shake text-red-500' : ''}`}>
        {[0, 1, 2].map(i => (
          <div key={i} className={`w-4 h-4 rounded-full transition-all duration-300 ${pin.length > i ? 'bg-gray-900 scale-125' : 'bg-gray-200'}`} />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 w-full max-w-[280px]">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((k, i) => (
          <button
            key={i}
            disabled={!k}
            onClick={() => k === '⌫' ? setPin(p => p.slice(0, -1)) : setPin(p => p + k)}
            className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-xl font-bold transition-all active:scale-90 ${
              !k ? 'opacity-0' : 'bg-white shadow-sm hover:shadow-md text-gray-900 border border-gray-50'
            }`}
          >
            {k}
          </button>
        ))}
      </div>
      <div className="h-6" />
    </div>
  );
};

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<'recipes' | 'menu'>('recipes');
  const [selected, setSelected] = useState<Recipe | null>(null);
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

  if (!isAuth) return <LoginView onLogin={() => { setIsAuth(true); sessionStorage.setItem('kitchen_auth', 'true'); }} />;

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-32 font-sans selection:bg-[#F27405]/20">
      {activeTab === 'recipes' ? (
        <>
          <header className="px-8 pt-16 pb-8">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h1 className="text-4xl font-serif font-bold text-gray-900">Kitchen Vault</h1>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gray-900 shadow-xl flex items-center justify-center overflow-hidden border border-white/20">
                 <img src="https://i.pravatar.cc/150?u=chef" className="w-full h-full object-cover opacity-90" alt="Avatar" />
              </div>
            </div>

            <div className="relative w-full rounded-[40px] overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
              <img 
                src="chef.png" 
                alt="Executive Chef" 
                className="w-full aspect-[16/9] object-cover transition-transform duration-1000 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=2000";
                }}
              />
              <div className="absolute bottom-8 left-8 z-20">
                 <span className="px-3 py-1 bg-[#F27405] text-white text-[9px] font-black uppercase tracking-widest rounded-lg mb-3 inline-block">Trending Now</span>
                 <h2 className="text-2xl font-serif text-white font-bold leading-tight">Mastering the Art of<br/>Asian Fusion</h2>
              </div>
            </div>
          </header>

          <main className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <section className="px-8 mt-12">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-serif font-bold text-gray-900">Featured Recipes</h3>
                <button className="text-[10px] font-black text-[#F27405] uppercase tracking-widest border-b-2 border-[#F27405]/20 pb-1">VIEW ALL</button>
              </div>

              <div className="grid gap-8">
                {RECIPES.map((recipe) => (
                  <div 
                    key={recipe.id} 
                    onClick={() => setSelected(recipe)}
                    className="group relative bg-white rounded-[32px] p-4 flex gap-6 shadow-sm border border-gray-50 active:scale-[0.98] transition-all hover:shadow-xl"
                  >
                    <div className="w-32 h-32 rounded-[24px] overflow-hidden flex-shrink-0 shadow-lg">
                      <img src={recipe.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={recipe.name} />
                    </div>
                    <div className="flex flex-col justify-center py-2 flex-1">
                      <span className="text-[9px] font-black text-[#F27405] uppercase tracking-widest mb-1.5">{recipe.category}</span>
                      <h4 className="text-xl font-serif font-bold text-gray-900 mb-2 leading-tight">{recipe.name}</h4>
                      <div className="flex items-center gap-4 text-gray-400 text-[10px] font-black uppercase tracking-tight">
                        <span className="flex items-center gap-1.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
                          {recipe.ingredients.length} Items
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                          {recipe.steps.length} Steps
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-6 right-6">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#F27405] group-hover:text-white transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </>
      ) : (
        <MenuView />
      )}

      {/* Floating Navigation Bar */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-gray-100 px-8 py-5 rounded-[32px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] flex items-center gap-12 z-40 transition-all">
        <button 
          onClick={() => setActiveTab('recipes')}
          className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
        >
          <RecipeIcon active={activeTab === 'recipes'} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'recipes' ? 'text-[#F27405]' : 'text-gray-400'}`}>Recipes</span>
        </button>
        <div className="w-px h-6 bg-gray-100"></div>
        <button 
          onClick={() => setActiveTab('menu')}
          className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
        >
          <MenuIcon active={activeTab === 'menu'} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'menu' ? 'text-[#F27405]' : 'text-gray-400'}`}>Menu</span>
        </button>
      </nav>

      {selected && (
        <RecipeDetail 
          recipe={selected} 
          onClose={() => setSelected(null)} 
          checkedIngredients={checkedIngredients}
          onToggleIngredient={handleToggle}
        />
      )}
    </div>
  );
}
