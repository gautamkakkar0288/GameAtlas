import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageTransition } from '@/components/shared/PageTransition';
import { gamesApi, libraryApi, type Game } from '@/lib/api';
import { Search as SearchIcon, X, Filter, Star, Plus, Check, Clock } from 'lucide-react';

function GameResultCard({ game, inLibrary, onAdd, onClick }: { game: Game; inLibrary: boolean; onAdd: (id: number) => void; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -2, borderColor: 'rgba(239,68,68,0.4)' }}
      className="group glass-panel rounded-xl border border-white/5 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_4px_30px_rgba(139,0,0,0.15)]"
      onClick={onClick}
    >
      <div className="flex gap-0">
        <div className="relative w-24 shrink-0 overflow-hidden">
          <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d0d0d]/80" />
        </div>
        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-orbitron font-bold text-white text-sm group-hover:text-red-100 transition-colors truncate">{game.title}</h3>
            <div className="flex items-center gap-1 shrink-0">
              <Star size={11} className="text-yellow-400" fill="currentColor" />
              <span className="font-orbitron text-xs text-white">{game.rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-rajdhani text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-red-950/40 border border-red-500/20 text-red-400 rounded">{game.genre}</span>
            <span className="font-rajdhani text-[10px] text-gray-500">{game.platform}</span>
            <span className="font-rajdhani text-[10px] text-gray-600">{game.releaseYear}</span>
          </div>
          <p className="font-inter text-xs text-gray-500 line-clamp-2 mb-3">{game.description}</p>
          <button
            onClick={(e) => { e.stopPropagation(); onAdd(game.id); }}
            disabled={inLibrary}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-rajdhani font-bold uppercase text-xs transition-all ${inLibrary ? 'bg-green-950/30 text-green-400 border border-green-500/20 cursor-default' : 'bg-red-900/30 hover:bg-red-900/50 text-red-300 border border-red-500/30'}`}
          >
            {inLibrary ? <><Check size={11} /> In Library</> : <><Plus size={11} /> Add to Library</>}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Search() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['All']);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['All']);
  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: searchData, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => gamesApi.search(debouncedQuery),
    staleTime: 15_000,
    enabled: true,
  });

  const { data: libraryData } = useQuery({
    queryKey: ['library'],
    queryFn: () => libraryApi.get(),
    staleTime: 30_000,
  });

  const addMutation = useMutation({
    mutationFn: (gameId: number) => libraryApi.add({ gameId, status: 'wishlist' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['library'] }),
  });

  const library = libraryData?.library ?? [];
  const libraryGameIds = new Set(library.filter((e) => e.game).map((e) => e.game!.id));
  const allResults = searchData?.games ?? [];

  const results = allResults.filter((g: import('@/lib/api').Game) => {
    if (minRating > 0 && g.rating < minRating) return false;
    if (!selectedGenres.includes('All') && !selectedGenres.includes(g.genre)) return false;
    if (!selectedPlatforms.includes('All') && !selectedPlatforms.includes(g.platform)) return false;
    return true;
  });

  const toggleFilter = (list: string[], item: string, setter: (v: string[]) => void) => {
    if (item === 'All') { setter(['All']); return; }
    const withoutAll = list.includes('All') ? [] : [...list];
    if (withoutAll.includes(item)) {
      const updated = withoutAll.filter((i) => i !== item);
      setter(updated.length === 0 ? ['All'] : updated);
    } else {
      setter([...withoutAll, item]);
    }
  };

  const GENRES = ['All', 'RPG', 'Action', 'Strategy', 'FPS', 'Adventure', 'Indie'];
  const PLATFORMS = ['All', 'Steam', 'Epic', 'Riot'];

  return (
    <AppLayout>
      <PageTransition>
        <div className="flex flex-col h-full min-h-[calc(100vh-100px)]">

          {/* Top Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-4xl mx-auto">
              <SearchIcon size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the Nexus..."
                className="w-full bg-[rgba(13,13,13,0.8)] backdrop-blur-xl border-2 border-white/10 rounded-2xl py-4 pl-14 pr-12 text-2xl font-orbitron font-bold text-white focus:outline-none focus:border-red-500 shadow-[0_0_30px_rgba(0,0,0,0.5)] focus:shadow-[0_0_30px_rgba(139,0,0,0.3)] transition-all placeholder:text-gray-600"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 flex-1">
            {/* Filter Sidebar */}
            <div className="w-full md:w-64 shrink-0 space-y-8 glass-panel p-6 rounded-xl h-fit sticky top-[80px]">
              <div className="flex items-center gap-2 font-orbitron font-bold text-white border-b border-white/10 pb-4">
                <Filter size={18} className="text-red-500" /> FILTERS
              </div>

              <div>
                <h4 className="font-rajdhani font-bold text-gray-400 uppercase tracking-widest text-xs mb-3">Platform</h4>
                <div className="space-y-2">
                  {PLATFORMS.map((p) => (
                    <label key={p} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleFilter(selectedPlatforms, p, setSelectedPlatforms)}>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedPlatforms.includes(p) ? 'bg-red-600 border-red-500 shadow-[0_0_10px_rgba(255,0,0,0.5)]' : 'bg-black/50 border-white/20 group-hover:border-white/50'}`}>
                        {selectedPlatforms.includes(p) && <div className="w-2 h-2 bg-white rounded-sm" />}
                      </div>
                      <span className={`font-inter text-sm ${selectedPlatforms.includes(p) ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{p}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-rajdhani font-bold text-gray-400 uppercase tracking-widest text-xs mb-3">Genre</h4>
                <div className="space-y-2">
                  {GENRES.map((g) => (
                    <label key={g} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleFilter(selectedGenres, g, setSelectedGenres)}>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedGenres.includes(g) ? 'bg-red-600 border-red-500 shadow-[0_0_10px_rgba(255,0,0,0.5)]' : 'bg-black/50 border-white/20 group-hover:border-white/50'}`}>
                        {selectedGenres.includes(g) && <div className="w-2 h-2 bg-white rounded-sm" />}
                      </div>
                      <span className={`font-inter text-sm ${selectedGenres.includes(g) ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-rajdhani font-bold text-gray-400 uppercase tracking-widest text-xs mb-3 flex justify-between">
                  <span>Min Rating</span>
                  <span className="text-yellow-400">{minRating > 0 ? `${minRating}+ ⭐` : 'Any'}</span>
                </h4>
                <input type="range" min="0" max="5" step="0.5" value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full accent-red-500" />
              </div>
            </div>

            {/* Results */}
            <div className="flex-1">
              <div className="mb-6 font-rajdhani font-bold text-gray-400 uppercase tracking-widest text-sm flex items-center justify-between">
                <span>{isLoading ? 'Searching...' : `Found ${results.length} Results`}</span>
                {debouncedQuery && <span className="text-gray-600">for "{debouncedQuery}"</span>}
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => <div key={i} className="animate-pulse bg-white/5 rounded-xl h-32" />)}
                </div>
              ) : results.length === 0 ? (
                <div className="glass-panel p-12 rounded-xl flex flex-col items-center justify-center text-center h-64 border-dashed border-white/10">
                  <SearchIcon size={48} className="text-white/10 mb-4" />
                  <h3 className="font-orbitron text-xl font-bold text-white mb-2">NO MATCHES FOUND</h3>
                  <p className="font-inter text-gray-500 text-sm">Try adjusting your filters or search query.</p>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div key={debouncedQuery} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {results.map((game, i) => (
                      <motion.div key={game.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3 }}>
                        <GameResultCard
                          game={game}
                          inLibrary={libraryGameIds.has(game.id)}
                          onAdd={addMutation.mutate}
                          onClick={() => setLocation(`/library/${game.slug}`)}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
