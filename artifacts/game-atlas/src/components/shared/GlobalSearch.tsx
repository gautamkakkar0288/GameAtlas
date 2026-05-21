import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, Gamepad2, User, Newspaper } from 'lucide-react';
import { useLocation } from 'wouter';
import { searchService } from '@/services/search.service';
import type { SearchResult } from '@/types';

// Global store for the modal state to allow opening from anywhere
let globalSetOpen: (open: boolean) => void = () => {};

export function useGlobalSearch() {
  const setOpen = (open: boolean) => globalSetOpen(open);
  return { setOpen };
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [trending, setTrending] = useState<string[]>([]);
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
      setRecent(searchService.getRecent());
      setTrending(searchService.getTrending());
      setQuery("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        setResults(searchService.query(query));
        setSelectedIndex(0);
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (q: string) => {
    if (!q.trim()) return;
    searchService.saveRecent(q);
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
              ) : (
                <div className="space-y-1">
                  {results.length > 0 ? (
                    results.map((r, i) => (
                      <div 
                        key={r.id} 
                        className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${selectedIndex === i ? 'bg-red-950/40 border border-red-500/30' : 'hover:bg-white/5 border border-transparent'}`}
                        onClick={() => handleSearch(r.title)}
                        onMouseEnter={() => setSelectedIndex(i)}
                      >
                        <div className="w-12 h-16 shrink-0 rounded overflow-hidden bg-black/50">
                          <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-orbitron font-bold text-white truncate text-sm mb-1">{r.title}</div>
                          <div className="flex items-center gap-2 font-rajdhani text-xs text-gray-400 font-semibold tracking-wider">
                            <span className="flex items-center gap-1 text-red-400">{getIcon(r.type)} {r.type.toUpperCase()}</span>
                            <span>•</span>
                            <span className="truncate">{r.subtitle}</span>
                          </div>
                        </div>
                        {r.meta && (
                          <div className="font-inter text-xs text-yellow-400 shrink-0 flex items-center gap-1">
                            ⭐ {r.meta}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Search size={48} className="mx-auto text-white/20 mb-4" />
                      <p className="font-rajdhani text-gray-400 font-semibold tracking-widest uppercase">No results found for "{query}"</p>
                    </div>
                  )}
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
