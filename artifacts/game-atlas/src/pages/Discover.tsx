import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageTransition } from '@/components/shared/PageTransition';
import { gamesApi, libraryApi, type Game } from '@/lib/api';
import { igdbApi, type IGDBGame } from '@/lib/igdb';
import {
  ChevronLeft, ChevronRight, Star, Clock, Plus, Check,
  TrendingUp, Sparkles, Award, Flame, CalendarDays, ExternalLink,
} from 'lucide-react';
import { SiSteam, SiEpicgames, SiRiotgames } from 'react-icons/si';

function PlatformIcon({ p, className = '' }: { p: string; className?: string }) {
  switch (p) {
    case 'Steam': return <SiSteam className={`text-[#66c0f4] ${className}`} />;
    case 'Epic': return <SiEpicgames className={`text-white ${className}`} />;
    case 'Riot': return <SiRiotgames className={`text-[#eb0029] ${className}`} />;
    default: return null;
  }
}

import { UnifiedGameCard } from '@/components/shared/UnifiedGameCard';

function GameCard({ game, inLibrary, onAdd }: { game: Game; inLibrary: boolean; onAdd: (id: number) => void }) {
  return (
    <div className="shrink-0 w-44 sm:w-48">
      <UnifiedGameCard
        game={game}
        variant="standard"
        inLibrary={inLibrary}
        onAddToLibrary={onAdd}
      />
    </div>
  );
}

function IGDBGameCard({ game }: { game: IGDBGame }) {
  return (
    <div className="shrink-0 w-44 sm:w-48">
      <UnifiedGameCard
        game={{
          id: game.id,
          slug: game.slug,
          name: game.name,
          cover: game.cover,
          genre: game.genres?.[0],
          genres: game.genres,
          platforms: game.platforms,
          rating: game.rating,
          firstReleaseDate: game.firstReleaseDate,
          summary: game.summary,
        }}
        variant="standard"
      />
    </div>
  );
}

function SectionRow({ title, subtitle, icon: Icon, badge, children }: {
  title: string; subtitle: string; icon: React.ElementType; badge?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Icon size={16} className="text-red-500" />
            <h2 className="font-orbitron text-lg font-black text-white tracking-widest uppercase border-l-4 border-red-600 pl-3">{title}</h2>
            {badge && (
              <span className="px-2 py-0.5 bg-red-600/20 border border-red-500/30 rounded text-red-400 font-rajdhani font-bold text-[10px] uppercase tracking-wider animate-pulse">
                {badge}
              </span>
            )}
          </div>
          <p className="font-rajdhani text-gray-500 text-xs uppercase tracking-widest mt-1 pl-7">{subtitle}</p>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x scroll-smooth" style={{ scrollbarWidth: 'none' }}>
        {children}
      </div>
    </div>
  );
}

function IGDBSectionSkeleton() {
  return (
    <div className="flex gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="shrink-0 w-48">
          <div className="animate-pulse bg-white/5 rounded-xl aspect-[3/4]" />
          <div className="mt-2 space-y-1 px-1">
            <div className="animate-pulse bg-white/5 h-3 w-32 rounded" />
            <div className="animate-pulse bg-white/5 h-2 w-20 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

const GENRES = ['All', 'RPG', 'Action', 'Strategy', 'FPS', 'Adventure', 'Indie', 'Sports', 'Racing', 'Puzzle'];
const PLATFORMS = ['All', 'Steam', 'Epic', 'Riot'];

const MOODS = [
  { id: 'story', label: 'Story-Rich', icon: '📖', genre: 'RPG', color: '#8b5cf6' },
  { id: 'action', label: 'Fast-Paced', icon: '⚡', genre: 'Action', color: '#ef4444' },
  { id: 'strategy', label: 'Strategic', icon: '♟️', genre: 'Strategy', color: '#3b82f6' },
  { id: 'fps', label: 'Competitive', icon: '🎯', genre: 'FPS', color: '#f59e0b' },
  { id: 'indie', label: 'Indie Gems', icon: '💎', genre: 'Indie', color: '#06b6d4' },
  { id: 'racing', label: 'Fast Lane', icon: '🏎️', genre: 'Racing', color: '#10b981' },
  { id: 'puzzle', label: 'Brain Training', icon: '🧩', genre: 'Puzzle', color: '#ec4899' },
  { id: 'sports', label: 'Sports', icon: '⚽', genre: 'Sports', color: '#84cc16' },
];

export default function Discover() {
  const [platform, setPlatform] = useState('All');
  const [genre, setGenre] = useState('All');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedMood, setSelectedMood] = useState('');
  const queryClient = useQueryClient();

  const { data: allGamesData, isLoading } = useQuery({
    queryKey: ['games-all'],
    queryFn: () => gamesApi.list({ limit: 50 }),
    staleTime: 60_000,
  });

  const { data: trendingData } = useQuery({
    queryKey: ['trending'],
    queryFn: () => gamesApi.trending(),
    staleTime: 60_000,
  });

  const { data: personalizedData } = useQuery({
    queryKey: ['personalized'],
    queryFn: () => recommendationsApi.forMe(),
    staleTime: 60_000,
  });

  const { data: libraryData } = useQuery({
    queryKey: ['library'],
    queryFn: () => libraryApi.get(),
    staleTime: 30_000,
  });

  const { data: igdbTrendingData, isLoading: igdbTrendingLoading } = useQuery({
    queryKey: ['igdb-trending'],
    queryFn: () => igdbApi.trending(12),
    staleTime: 15 * 60_000,
  });

  const { data: igdbUpcomingData, isLoading: igdbUpcomingLoading } = useQuery({
    queryKey: ['igdb-upcoming'],
    queryFn: () => igdbApi.upcoming(12),
    staleTime: 60 * 60_000,
  });

  const { data: igdbTopRatedData, isLoading: igdbTopRatedLoading } = useQuery({
    queryKey: ['igdb-top-rated'],
    queryFn: () => igdbApi.topRated(12),
    staleTime: 60 * 60_000,
  });

  const addMutation = useMutation({
    mutationFn: (gameId: number) => libraryApi.add({ gameId, status: 'wishlist' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['library'] }),
  });

  const allGames = allGamesData?.games ?? [];
  const library = libraryData?.library ?? [];
  const libraryGameIds = new Set(library.filter((e) => e.game).map((e) => e.game!.id));

  const filtered = allGames.filter((g) => {
    if (platform !== 'All' && g.platform !== platform) return false;
    if (genre !== 'All' && g.genre !== genre) return false;
    return true;
  });

  const trending = trendingData?.games ?? filtered.slice(0, 8);
  const personalized = personalizedData?.recommendations ?? [];
  const topRated = [...filtered].sort((a, b) => b.rating - a.rating).slice(0, 8);
  const newReleases = [...filtered].sort((a, b) => b.releaseYear - a.releaseYear).slice(0, 8);
  const featured = allGames.slice(0, 5);

  const igdbTrending = igdbTrendingData?.games ?? [];
  const igdbUpcoming = igdbUpcomingData?.games ?? [];
  const igdbTopRated = igdbTopRatedData?.games ?? [];

  useEffect(() => {
    if (featured.length === 0) return;
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % featured.length), 4000);
    return () => clearInterval(timer);
  }, [featured.length]);

  const handleAdd = (gameId: number) => {
    if (!libraryGameIds.has(gameId)) addMutation.mutate(gameId);
  };

  return (
    <AppLayout>
      <PageTransition>
        <div className="space-y-12 pb-16">

          {/* Featured Hero Carousel */}
          {featured.length > 0 && (
            <div className="relative w-full h-[500px] rounded-2xl overflow-hidden group border border-white/10">
              <AnimatePresence mode="wait">
                <motion.div key={currentSlide}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0">
                  <div className="absolute inset-0 bg-black/40 z-10" />
                  <img src={featured[currentSlide]?.bannerImage ?? featured[currentSlide]?.coverImage} alt="Background"
                    className="w-full h-full object-cover blur-sm opacity-40 scale-110" />

                  <div className="absolute inset-0 z-20 flex items-center px-8 md:px-16">
                    <div className="w-full max-w-2xl bg-[rgba(13,13,13,0.6)] backdrop-blur-md border border-[rgba(139,0,0,0.3)] rounded-xl p-8 shadow-[0_0_30px_rgba(139,0,0,0.2)]">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-red-600/80 font-rajdhani font-bold text-white uppercase text-xs tracking-widest rounded">Featured</span>
                        <span className="px-3 py-1 bg-white/10 font-rajdhani font-bold text-gray-300 uppercase text-xs tracking-widest rounded flex items-center gap-2">
                          <PlatformIcon p={featured[currentSlide]?.platform ?? ''} />
                          {featured[currentSlide]?.platform}
                        </span>
                        <span className="px-3 py-1 bg-white/10 font-rajdhani font-bold text-gray-300 uppercase text-xs tracking-widest rounded">{featured[currentSlide]?.genre}</span>
                      </div>
                      <h1 className="font-orbitron text-4xl md:text-5xl font-black text-white tracking-wider mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        {featured[currentSlide]?.title}
                      </h1>
                      <div className="flex items-center gap-6 mb-6 font-inter text-gray-300 text-sm">
                        <span className="flex items-center gap-1 text-yellow-400"><Star size={16} fill="currentColor" /> {featured[currentSlide]?.rating.toFixed(1)}</span>
                      </div>
                      <p className="font-inter text-gray-400 mb-8 line-clamp-2 max-w-xl">{featured[currentSlide]?.description}</p>
                      <div className="flex gap-4">
                        <Link href={`/library/${featured[currentSlide]?.slug}`}>
                          <button className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-rajdhani uppercase font-bold tracking-widest rounded shadow-[0_0_20px_rgba(139,0,0,0.4)] transition-all">
                            Explore Now
                          </button>
                        </Link>
                        <button
                          onClick={() => handleAdd(featured[currentSlide]?.id)}
                          disabled={libraryGameIds.has(featured[currentSlide]?.id)}
                          className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-rajdhani uppercase font-bold tracking-widest rounded transition-all disabled:opacity-60 flex items-center gap-2"
                        >
                          {libraryGameIds.has(featured[currentSlide]?.id) ? <><Check size={14} /> In Library</> : <><Plus size={14} /> Add to Library</>}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="absolute right-16 top-1/2 -translate-y-1/2 w-[280px] h-[400px] z-20 hidden lg:block rounded-xl overflow-hidden border border-white/20 shadow-[0_0_40px_rgba(139,0,0,0.5)]">
                    <img src={featured[currentSlide]?.coverImage} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 bg-black/40 backdrop-blur px-4 py-2 rounded-full border border-white/10">
                <button onClick={() => setCurrentSlide((prev) => (prev - 1 + featured.length) % featured.length)} className="text-white hover:text-red-400 transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <div className="flex gap-2">
                  {featured.map((_, idx) => (
                    <button key={idx} onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all ${currentSlide === idx ? 'bg-red-500 w-6 shadow-[0_0_10px_rgba(255,0,0,0.8)]' : 'bg-white/30 w-2'}`} />
                  ))}
                </div>
                <button onClick={() => setCurrentSlide((prev) => (prev + 1) % featured.length)} className="text-white hover:text-red-400 transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Mood Picker */}
          <div>
            <p className="font-rajdhani uppercase text-xs tracking-[0.2em] text-gray-500 mb-3">What do you feel like playing?</p>
            <div className="flex gap-3 overflow-x-auto pb-3" style={{ scrollbarWidth: 'none' }}>
              {MOODS.map((m) => (
                <motion.button
                  key={m.id}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    if (selectedMood === m.id) {
                      setSelectedMood('');
                      setGenre('All');
                    } else {
                      setSelectedMood(m.id);
                      setGenre(m.genre);
                    }
                  }}
                  className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-rajdhani font-bold text-sm uppercase tracking-wider border transition-all whitespace-nowrap"
                  style={selectedMood === m.id ? {
                    backgroundColor: `${m.color}18`,
                    borderColor: `${m.color}60`,
                    color: m.color,
                    boxShadow: `0 0 15px ${m.color}25`,
                  } : {
                    backgroundColor: 'rgba(13,13,13,0.6)',
                    borderColor: 'rgba(255,255,255,0.08)',
                    color: '#9ca3af',
                  }}
                >
                  <span className="text-base">{m.icon}</span>
                  <span>{m.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="sticky top-[60px] z-40 bg-[rgba(5,5,5,0.85)] backdrop-blur-xl border-b border-white/10 py-4 flex flex-col xl:flex-row gap-4 justify-between items-center -mx-4 px-4 md:-mx-8 md:px-8">
            <div className="flex gap-2 overflow-x-auto w-full scrollbar-hide pb-2 xl:pb-0 snap-x">
              {GENRES.map((g) => (
                <button key={g} onClick={() => setGenre(g)}
                  className={`px-5 py-2 rounded-full font-rajdhani font-bold uppercase tracking-wider text-sm whitespace-nowrap snap-center transition-all ${genre === g ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(139,0,0,0.5)] border border-red-400' : 'bg-[rgba(13,13,13,0.6)] border border-white/10 text-gray-400 hover:text-white hover:border-red-500/50'}`}>
                  {g}
                </button>
              ))}
            </div>
            <div className="flex gap-2 shrink-0">
              {PLATFORMS.map((p) => (
                <button key={p} onClick={() => setPlatform(p)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${platform === p ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(139,0,0,0.5)] border border-red-400' : 'bg-[rgba(13,13,13,0.6)] border border-white/10 text-gray-400 hover:text-white hover:border-red-500/50'}`}
                  title={p}>
                  {p === 'All' ? <span className="font-rajdhani font-bold text-xs">ALL</span> : <PlatformIcon p={p} />}
                </button>
              ))}
            </div>
          </div>

          {/* Local DB Sections */}
          {isLoading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="animate-pulse bg-white/5 h-6 w-48 rounded" />
                  <div className="flex gap-4">
                    {Array.from({ length: 6 }).map((_, j) => <div key={j} className="animate-pulse bg-white/5 rounded-xl w-48 aspect-[3/4] shrink-0" />)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {personalized.length > 0 && (
                <SectionRow title="Personalized for You" subtitle="Based on your Gaming DNA" icon={Sparkles} badge="DNA">
                  {personalized.map((g) => <GameCard key={g.id} game={g} inLibrary={libraryGameIds.has(g.id)} onAdd={handleAdd} />)}
                </SectionRow>
              )}
              {trending.length > 0 && (
                <SectionRow title="Trending Now" subtitle="Most played this week" icon={TrendingUp}>
                  {trending.map((g) => <GameCard key={g.id} game={g} inLibrary={libraryGameIds.has(g.id)} onAdd={handleAdd} />)}
                </SectionRow>
              )}
              {newReleases.length > 0 && (
                <SectionRow title="New Releases" subtitle="Fresh drops in the Nexus" icon={Sparkles}>
                  {newReleases.map((g) => <GameCard key={g.id} game={g} inLibrary={libraryGameIds.has(g.id)} onAdd={handleAdd} />)}
                </SectionRow>
              )}
              {topRated.length > 0 && (
                <SectionRow title="Top Rated" subtitle="Critically acclaimed masterpieces" icon={Award}>
                  {topRated.map((g) => <GameCard key={g.id} game={g} inLibrary={libraryGameIds.has(g.id)} onAdd={handleAdd} />)}
                </SectionRow>
              )}
            </>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-900/40 to-transparent" />
            <span className="font-rajdhani font-bold text-xs text-red-500/60 uppercase tracking-[0.3em] px-4">Live from IGDB</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-900/40 to-transparent" />
          </div>

          {/* IGDB Trending */}
          <SectionRow title="Trending Globally" subtitle="Real-time popularity from IGDB" icon={Flame} badge="Live">
            {igdbTrendingLoading ? <IGDBSectionSkeleton /> : igdbTrending.map((g) => <IGDBGameCard key={g.id} game={g} />)}
          </SectionRow>

          {/* IGDB Upcoming */}
          <SectionRow title="Upcoming Releases" subtitle="Most anticipated games coming soon" icon={CalendarDays} badge="Live">
            {igdbUpcomingLoading ? <IGDBSectionSkeleton /> : igdbUpcoming.map((g) => <IGDBGameCard key={g.id} game={g} />)}
          </SectionRow>

          {/* IGDB Top Rated */}
          <SectionRow title="All-Time Greats" subtitle="Highest rated games on IGDB" icon={Award} badge="Live">
            {igdbTopRatedLoading ? <IGDBSectionSkeleton /> : igdbTopRated.map((g) => <IGDBGameCard key={g.id} game={g} />)}
          </SectionRow>

        </div>
      </PageTransition>
    </AppLayout>
  );
}
