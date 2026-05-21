import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageTransition } from '@/components/shared/PageTransition';
import { Gamepad2, Star, Clock, ExternalLink, Search, Zap, Trophy, Users, ChevronRight } from 'lucide-react';

interface ArcadeGame {
  id: string;
  title: string;
  genre: string;
  thumbnail: string;
  provider: 'Poki' | 'CrazyGames';
  url: string;
  rating: number;
  players: string;
  featured?: boolean;
  tags: string[];
}

const ARCADE_GAMES: ArcadeGame[] = [
  {
    id: 'subway-surfers',
    title: 'Subway Surfers',
    genre: 'Runner',
    thumbnail: 'https://images.crazygames.com/subway-surfers_16x9/20240827120116/subway-surfers_16x9-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=675',
    provider: 'CrazyGames',
    url: 'https://www.crazygames.com/game/subway-surfers',
    rating: 4.8,
    players: '1B+',
    featured: true,
    tags: ['endless', 'casual', 'mobile'],
  },
  {
    id: 'moto-x3m',
    title: 'Moto X3M',
    genre: 'Racing',
    thumbnail: 'https://images.crazygames.com/moto-x3m_16x9/20240827120116/moto-x3m_16x9-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=675',
    provider: 'CrazyGames',
    url: 'https://www.crazygames.com/game/moto-x3m',
    rating: 4.7,
    players: '500M+',
    featured: true,
    tags: ['racing', 'physics', 'stunts'],
  },
  {
    id: 'krunker',
    title: 'Krunker.io',
    genre: 'FPS',
    thumbnail: 'https://images.crazygames.com/krunker-io_16x9/20240827120116/krunker-io_16x9-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=675',
    provider: 'CrazyGames',
    url: 'https://www.crazygames.com/game/krunker',
    rating: 4.6,
    players: '200M+',
    featured: true,
    tags: ['fps', 'multiplayer', 'competitive'],
  },
  {
    id: 'chess',
    title: 'Chess',
    genre: 'Strategy',
    thumbnail: 'https://images.crazygames.com/chess_16x9/20240827120116/chess_16x9-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=675',
    provider: 'CrazyGames',
    url: 'https://www.crazygames.com/game/chess',
    rating: 4.9,
    players: '100M+',
    tags: ['strategy', 'board', 'classic'],
  },
  {
    id: '8-ball-pool',
    title: '8 Ball Pool',
    genre: 'Sports',
    thumbnail: 'https://images.crazygames.com/8-ball-pool_16x9/20240827120116/8-ball-pool_16x9-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=675',
    provider: 'CrazyGames',
    url: 'https://www.crazygames.com/game/8-ball-pool',
    rating: 4.5,
    players: '300M+',
    tags: ['sports', 'billiards', 'multiplayer'],
  },
  {
    id: 'fireboy-watergirl',
    title: 'Fireboy & Watergirl',
    genre: 'Puzzle',
    thumbnail: 'https://images.crazygames.com/fireboy-and-watergirl-1-the-forest-temple_16x9/20240827120116/fireboy-and-watergirl-1-the-forest-temple_16x9-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=675',
    provider: 'CrazyGames',
    url: 'https://www.crazygames.com/game/fireboy-and-watergirl-1-the-forest-temple',
    rating: 4.7,
    players: '400M+',
    tags: ['puzzle', 'coop', 'platformer'],
  },
  {
    id: 'slope',
    title: 'Slope',
    genre: 'Arcade',
    thumbnail: 'https://images.crazygames.com/slope_16x9/20240827120116/slope_16x9-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=675',
    provider: 'CrazyGames',
    url: 'https://www.crazygames.com/game/slope',
    rating: 4.4,
    players: '100M+',
    tags: ['endless', '3d', 'reflex'],
  },
  {
    id: 'snake',
    title: 'Snake',
    genre: 'Classic',
    thumbnail: 'https://images.crazygames.com/snake-io_16x9/20240827120116/snake-io_16x9-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=675',
    provider: 'Poki',
    url: 'https://poki.com/en/g/snake',
    rating: 4.3,
    players: '50M+',
    tags: ['classic', 'io', 'casual'],
  },
  {
    id: 'stickman-hook',
    title: 'Stickman Hook',
    genre: 'Action',
    thumbnail: 'https://images.crazygames.com/stickman-hook_16x9/20240827120116/stickman-hook_16x9-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=675',
    provider: 'CrazyGames',
    url: 'https://www.crazygames.com/game/stickman-hook',
    rating: 4.6,
    players: '250M+',
    tags: ['physics', 'platformer', 'skill'],
  },
  {
    id: 'among-us',
    title: 'Among Us Online',
    genre: 'Social',
    thumbnail: 'https://images.crazygames.com/among-us-online_16x9/20240827120116/among-us-online_16x9-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=675',
    provider: 'CrazyGames',
    url: 'https://www.crazygames.com/game/among-us-online',
    rating: 4.5,
    players: '150M+',
    tags: ['social', 'multiplayer', 'deduction'],
  },
  {
    id: 'minecraft-classic',
    title: 'Minecraft Classic',
    genre: 'Sandbox',
    thumbnail: 'https://images.crazygames.com/minecraft-classic_16x9/20240827120116/minecraft-classic_16x9-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=675',
    provider: 'CrazyGames',
    url: 'https://www.crazygames.com/game/minecraft-classic',
    rating: 4.8,
    players: '500M+',
    featured: true,
    tags: ['sandbox', 'building', 'classic'],
  },
  {
    id: 'wordle',
    title: 'Wordle',
    genre: 'Word',
    thumbnail: 'https://images.crazygames.com/wordle_16x9/20240827120116/wordle_16x9-cover?auto=format%2Ccompress&q=75&cs=strip&ch=DPR&w=1200&h=675',
    provider: 'Poki',
    url: 'https://poki.com/en/g/wordle',
    rating: 4.6,
    players: '50M+',
    tags: ['word', 'daily', 'puzzle'],
  },
];

const GENRES = ['All', 'Runner', 'Racing', 'FPS', 'Strategy', 'Sports', 'Puzzle', 'Arcade', 'Classic', 'Action', 'Social', 'Sandbox', 'Word'];

const providerConfig = {
  Poki: { color: '#9333ea', bg: '#1e1b4b' },
  CrazyGames: { color: '#ef4444', bg: '#1c0a0a' },
};

function ArcadeGameCard({ game, recentlyPlayed, onPlay }: { game: ArcadeGame; recentlyPlayed: boolean; onPlay: (id: string) => void }) {
  const conf = providerConfig[game.provider];

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      className="group cursor-pointer"
      onClick={() => onPlay(game.id)}
    >
      <a href={game.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
        className="block" onMouseDown={() => onPlay(game.id)}>
        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group-hover:border-red-500/40 transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(139,0,0,0.3)]">
          <img src={game.thumbnail} alt={game.title} loading="lazy"
            className="w-full h-full object-cover opacity-70 group-hover:opacity-50 group-hover:scale-110 transition-all duration-500"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.style.display = 'none';
              target.parentElement!.style.background = `linear-gradient(135deg, ${conf.color}30, #050505)`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

          {game.featured && (
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-600/80 rounded font-rajdhani text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm">
              Featured
            </div>
          )}
          {recentlyPlayed && (
            <div className="absolute top-2 right-2 px-2 py-0.5 bg-green-800/80 rounded font-rajdhani text-[10px] font-bold text-green-300 uppercase tracking-wider backdrop-blur-sm flex items-center gap-1">
              <Clock size={9} /> Played
            </div>
          )}

          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center mb-2 bg-black/40">
              <ExternalLink size={22} className="text-white" />
            </div>
            <span className="font-rajdhani font-bold text-white uppercase text-sm tracking-widest">Play Now</span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="flex items-center justify-between">
              <span className="font-rajdhani text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ color: conf.color, backgroundColor: `${conf.color}20` }}>{game.provider}</span>
              <div className="flex items-center gap-1">
                <Star size={10} className="text-yellow-400" fill="currentColor" />
                <span className="font-orbitron text-[10px] text-white">{game.rating}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2 px-1">
          <p className="font-orbitron font-bold text-white text-sm truncate group-hover:text-red-200 transition-colors">{game.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-rajdhani text-[10px] text-gray-500 uppercase tracking-wider">{game.genre}</span>
            <span className="text-gray-700">·</span>
            <span className="flex items-center gap-1 font-rajdhani text-[10px] text-gray-500"><Users size={9} />{game.players}</span>
          </div>
        </div>
      </a>
    </motion.div>
  );
}

export default function Arcade() {
  const [genre, setGenre] = useState('All');
  const [search, setSearch] = useState('');
  const [recentlyPlayed, setRecentlyPlayed] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('arcade_recent');
    if (stored) setRecentlyPlayed(JSON.parse(stored));
  }, []);

  const handlePlay = (id: string) => {
    setRecentlyPlayed((prev) => {
      const updated = [id, ...prev.filter((x) => x !== id)].slice(0, 12);
      localStorage.setItem('arcade_recent', JSON.stringify(updated));
      return updated;
    });
  };

  const filtered = ARCADE_GAMES.filter((g) => {
    if (genre !== 'All' && g.genre !== genre) return false;
    if (search && !g.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const featured = ARCADE_GAMES.filter((g) => g.featured);
  const recent = ARCADE_GAMES.filter((g) => recentlyPlayed.includes(g.id))
    .sort((a, b) => recentlyPlayed.indexOf(a.id) - recentlyPlayed.indexOf(b.id));

  return (
    <AppLayout>
      <PageTransition>
        <div className="space-y-10 pb-16">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-orbitron text-3xl md:text-4xl font-black text-white tracking-widest border-l-4 border-red-600 pl-4 uppercase flex items-center gap-4">
                <Gamepad2 className="text-red-500" size={32} /> Arcade
              </h1>
              <p className="font-rajdhani text-gray-400 uppercase tracking-widest mt-1 pl-5">Instant-play browser games — no download required</p>
            </div>
            <div className="relative w-full md:w-64">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Find a game..."
                className="w-full bg-black/50 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm font-inter text-white focus:outline-none focus:border-red-500/50 placeholder:text-gray-600 transition-all" />
            </div>
          </div>

          {/* Stats Banner */}
          <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-wrap gap-8 justify-around">
            {[
              { icon: Gamepad2, label: 'Games Available', value: ARCADE_GAMES.length, color: '#ef4444' },
              { icon: Zap, label: 'Instant Play', value: 'No Download', color: '#eab308', isStr: true },
              { icon: Trophy, label: 'Recently Played', value: recent.length, color: '#22c55e' },
              { icon: Users, label: 'Total Players', value: '2B+', color: '#a855f7', isStr: true },
            ].map(({ icon: Icon, label, value, color, isStr }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <div>
                  <div className="font-orbitron text-lg font-black text-white">{value}</div>
                  <div className="font-rajdhani text-xs text-gray-500 uppercase tracking-wider">{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Featured */}
          {!search && genre === 'All' && (
            <section>
              <h2 className="font-orbitron text-lg font-black text-white tracking-widest uppercase border-l-4 border-red-600 pl-3 mb-5 flex items-center gap-3">
                <Zap size={16} className="text-red-500" /> Featured Games
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {featured.map((game, i) => (
                  <motion.div key={game.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <ArcadeGameCard game={game} recentlyPlayed={recentlyPlayed.includes(game.id)} onPlay={handlePlay} />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Recently Played */}
          {!search && genre === 'All' && recent.length > 0 && (
            <section>
              <h2 className="font-orbitron text-lg font-black text-white tracking-widest uppercase border-l-4 border-green-600 pl-3 mb-5 flex items-center gap-3">
                <Clock size={16} className="text-green-500" /> Recently Played
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {recent.slice(0, 6).map((game) => (
                  <div key={game.id} className="shrink-0 w-44">
                    <ArcadeGameCard game={game} recentlyPlayed={true} onPlay={handlePlay} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Genre Filters */}
          <div className="flex gap-2 flex-wrap">
            {GENRES.map((g) => (
              <button key={g} onClick={() => setGenre(g)}
                className={`px-4 py-2 rounded-full font-rajdhani font-bold uppercase tracking-wider text-xs transition-all ${genre === g ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(139,0,0,0.4)] border border-red-400' : 'bg-white/5 border border-transparent text-gray-400 hover:text-white hover:bg-white/10'}`}>
                {g}
              </button>
            ))}
          </div>

          {/* All Games Grid */}
          <section>
            <h2 className="font-orbitron text-lg font-black text-white tracking-widest uppercase border-l-4 border-red-600 pl-3 mb-5">
              {search ? `Results for "${search}"` : genre === 'All' ? 'All Games' : genre}
              <span className="font-inter text-sm text-gray-500 font-normal ml-3">{filtered.length} games</span>
            </h2>

            {filtered.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 text-center">
                <Gamepad2 size={48} className="text-gray-700 mx-auto mb-4" />
                <p className="font-orbitron text-gray-500 text-lg">No games found.</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div key={`${genre}-${search}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {filtered.map((game, i) => (
                    <motion.div key={game.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}>
                      <ArcadeGameCard game={game} recentlyPlayed={recentlyPlayed.includes(game.id)} onPlay={handlePlay} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </section>

          {/* Provider Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {([
              { name: 'Poki', desc: 'Thousands of free browser games — play instantly, no download.', url: 'https://poki.com', color: '#9333ea' },
              { name: 'CrazyGames', desc: 'Best free online games — new titles added daily.', url: 'https://www.crazygames.com', color: '#ef4444' },
            ] as const).map((provider) => (
              <a key={provider.name} href={provider.url} target="_blank" rel="noopener noreferrer"
                className="group glass-panel rounded-2xl p-6 border border-white/5 hover:border-white/15 transition-all flex items-center justify-between">
                <div>
                  <h3 className="font-orbitron font-bold text-white mb-1" style={{ textShadow: `0 0 20px ${provider.color}50` }}>{provider.name}</h3>
                  <p className="font-inter text-gray-500 text-sm">{provider.desc}</p>
                </div>
                <ChevronRight size={20} className="text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </a>
            ))}
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
