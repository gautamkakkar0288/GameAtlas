import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, Gamepad2, User, Newspaper, Star, ChevronRight, Loader2 } from 'lucide-react';
import { useLocation, Link } from 'wouter';
import { gamesApi, usersApi, type Game } from '@/lib/api';
import { igdbApi, type IGDBGame } from '@/lib/igdb';
import { GameMedia } from './GameMedia';

let globalSetOpen: (open: boolean) => void = () => {};

export function useGlobalSearch() {
  const setOpen = (open: boolean) => globalSetOpen(open);
  return { setOpen };
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | "games" | "community">("all");
  const [results, setResults] = useState<Array<{ id: number | string; title: string; subtitle: string; imageUrl?: string | null; slug?: string; rating?: number; type: "game" | "user" }>>([]);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [trending] = useState<string[]>([
    "Elden Ring",
    "Cyberpunk 2077",
    "God of War",
    "Hollow Knight",
    "Hades",
  ]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [, setLocation] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    globalSetOpen = setOpen;
    return () => { globalSetOpen = () => {}; };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      try {
        setRecent(JSON.parse(localStorage.getItem('ga_recent_searches') || '[]'));
      } catch {
        setRecent([]);
      }
      setQuery("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        // Query both local database games and IGDB
        const localRes = await gamesApi.search(query).catch(() => ({ games: [] }));
        const localGames = (localRes.games || []).map((g: Game) => ({
          id: g.id,
          title: g.title,
          subtitle: `${g.genre} • ${g.platform}`,
          imageUrl: g.coverImage,
          slug: g.slug,
          rating: g.rating,
          type: "game" as const,
        }));

        setResults(localGames.slice(0, 8));
        setSelectedIndex(0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const saveRecent = (q: string) => {
    try {
      const stored = JSON.parse(localStorage.getItem('ga_recent_searches') || '[]');
      const updated = [q, ...stored.filter((r: string) => r !== q)].slice(0, 5);
      localStorage.setItem('ga_recent_searches', JSON.stringify(updated));
    } catch {}
  };

  const handleSelectGame = (slug?: string, titleToSave?: string) => {
    if (titleToSave) saveRecent(titleToSave);
    setOpen(false);
    if (slug) {
      setLocation(`/library/${slug}`);
    } else {
      setLocation(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleSearch = (q: string) => {
    if (!q.trim()) return;
    saveRecent(q);
    setOpen(false);
    setLocation(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0 && selectedIndex >= 0) {
        // In a real app, this might navigate directly to the item based on type
        // For now, we'll navigate to search page with the query
        handleSearch(results[selectedIndex].title);
      } else if (query.trim()) {
        handleSearch(query);
      }
    }
  };

  const getIcon = (type: string) => {
    if (type === 'game') return <Gamepad2 size={16} />;
    if (type === 'player') return <User size={16} />;
    if (type === 'news') return <Newspaper size={16} />;
    return <Search size={16} />;
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl bg-[rgba(13,13,13,0.8)] backdrop-blur-xl border border-red-900/40 shadow-[0_0_30px_rgba(139,0,0,0.3)] rounded-xl overflow-hidden relative z-10 flex flex-col max-h-[80vh]"
          >
            <div className="flex items-center px-4 py-4 border-b border-white/10 relative">
              <Search className="text-gray-400 shrink-0" size={24} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search games, players, news..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none text-xl font-rajdhani font-semibold text-white px-4 focus:outline-none placeholder:text-gray-500"
              />
              <div className="flex items-center gap-2">
                <kbd className="hidden sm:inline-block px-2 py-1 bg-white/10 rounded font-mono text-[10px] text-gray-400">ESC</kbd>
                <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {!query.trim() ? (
                <div className="p-4 space-y-6">
                  {recent.length > 0 && (
                    <div>
                      <h3 className="font-rajdhani font-bold text-gray-400 text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Clock size={16} className="text-red-500" /> Recent
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {recent.map(r => (
                          <button key={r} onClick={() => handleSearch(r)} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded font-inter text-sm text-gray-300 transition-colors">
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-rajdhani font-bold text-gray-400 text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                      <TrendingUp size={16} className="text-red-500" /> Trending Now
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {trending.map(t => (
                        <button key={t} onClick={() => handleSearch(t)} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded font-inter text-sm text-gray-300 transition-colors">
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center py-12 gap-3 text-red-500">
                  <Loader2 className="animate-spin" size={24} />
                  <span className="font-rajdhani uppercase tracking-widest text-sm font-bold text-gray-400">Querying Nexus Database...</span>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((r, i) => (
                    <div 
                      key={r.id} 
                      className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${selectedIndex === i ? 'bg-red-950/40 border border-red-500/30' : 'hover:bg-white/5 border border-transparent'}`}
                      onClick={() => handleSelectGame(r.slug, r.title)}
                      onMouseEnter={() => setSelectedIndex(i)}
                    >
                      <div className="w-12 h-16 shrink-0 rounded overflow-hidden">
                        <GameMedia src={r.imageUrl} alt={r.title} title={r.title} aspectRatio="3/4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-orbitron font-bold text-white truncate text-sm mb-1">{r.title}</div>
                        <div className="flex items-center gap-2 font-rajdhani text-xs text-gray-400 font-semibold tracking-wider">
                          <span className="flex items-center gap-1 text-red-400"><Gamepad2 size={12} /> GAME</span>
                          <span>•</span>
                          <span className="truncate">{r.subtitle}</span>
                        </div>
                      </div>
                      {r.rating !== undefined && r.rating > 0 && (
                        <div className="font-orbitron text-xs text-yellow-400 shrink-0 flex items-center gap-1">
                          <Star size={12} fill="currentColor" /> {r.rating.toFixed(1)}
                        </div>
                      )}
                      <ChevronRight size={16} className="text-gray-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search size={48} className="mx-auto text-white/20 mb-4" />
                  <p className="font-rajdhani text-gray-400 font-semibold tracking-widest uppercase">No games found for "{query}"</p>
                  <button
                    onClick={() => handleSearch(query)}
                    className="mt-4 px-4 py-2 bg-red-600/30 hover:bg-red-600/50 text-red-300 border border-red-500/30 rounded font-rajdhani uppercase text-xs font-bold tracking-wider transition-colors cursor-pointer"
                  >
                    Search full catalog
                  </button>
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-white/10 bg-black/40 flex items-center justify-between">
              <div className="font-inter text-[11px] text-gray-500 flex gap-4">
                <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1 rounded">↑</kbd><kbd className="bg-white/10 px-1 rounded">↓</kbd> to navigate</span>
                <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1 rounded">↵</kbd> to select</span>
              </div>
              <div className="font-orbitron font-bold text-[10px] tracking-widest text-red-500/50">GAMEATLAS SEARCH</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
