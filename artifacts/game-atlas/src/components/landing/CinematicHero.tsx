import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Play, Compass, ChevronRight, ChevronLeft, Star, Flame, Sparkles, Shield, Trophy } from "lucide-react";
import { GameMedia } from "@/components/shared/GameMedia";
import { UnifiedGameCard } from "@/components/shared/UnifiedGameCard";

const FEATURED_GAMES = [
  {
    id: 1,
    slug: "god-of-war-ragnarok",
    title: "God of War: Ragnarök",
    tagline: "The Nine Realms Tremble Before Kratos",
    genre: "Action RPG",
    rating: 4.9,
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5vmg.webp",
    backdropImage: "https://images.igdb.com/igdb/image/upload/t_1080p/sc9f04.webp",
    archetypeMatch: "Story Explorer & Combat Master",
    dnaScore: 98,
    stats: { completions: "1.4M", awards: "Game of the Year Nominee" },
  },
  {
    id: 2,
    slug: "elden-ring",
    title: "Elden Ring",
    tagline: "Rise, Tarnished, and Claim the Elden Throne",
    genre: "Dark Fantasy RPG",
    rating: 4.9,
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.webp",
    backdropImage: "https://images.igdb.com/igdb/image/upload/t_1080p/sc8y4g.webp",
    archetypeMatch: "Completionist & Tactical Strategist",
    dnaScore: 96,
    stats: { completions: "2.1M", awards: "Game of the Year Winner" },
  },
  {
    id: 3,
    slug: "cyberpunk-2077",
    title: "Cyberpunk 2077",
    tagline: "Night City Changes Every Soul Who Walks It",
    genre: "Sci-Fi Action RPG",
    rating: 4.7,
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4a7a.webp",
    backdropImage: "https://images.igdb.com/igdb/image/upload/t_1080p/sc8y0b.webp",
    archetypeMatch: "Immersion Specialist",
    dnaScore: 94,
    stats: { completions: "3.5M", awards: "Best Ongoing Game" },
  },
];

export function CinematicHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentGame = FEATURED_GAMES[activeIndex];

  // Auto-rotate every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FEATURED_GAMES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[92dvh] w-full flex items-center justify-center overflow-hidden bg-[#050505] select-none">
      {/* Background Media with layered depth */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentGame.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.35, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <img
            src={currentGame.backdropImage}
            alt={currentGame.title}
            className="w-full h-full object-cover object-center filter blur-[2px]"
          />
        </motion.div>
      </AnimatePresence>

      {/* Atmospheric dark vignette gradients */}
      <div className="absolute inset-0 z-1 bg-radial from-transparent via-[#050505]/70 to-[#050505] pointer-events-none" />
      <div className="absolute inset-0 z-1 bg-linear-to-t from-[#050505] via-[#050505]/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-1 bg-linear-to-r from-[#050505] via-[#050505]/50 to-transparent pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col justify-between min-h-[85dvh]">
        {/* Top Tagline / Brand Badge */}
        <div className="flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/40 border border-red-500/30 text-red-400 backdrop-blur-md">
            <Flame size={14} className="text-red-500 animate-pulse" />
            <span className="font-rajdhani text-xs uppercase tracking-[0.25em] font-bold">
              Gaming DNA Intelligence Platform
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-orbitron text-xs text-gray-400">
            <span>0{activeIndex + 1}</span>
            <div className="w-12 h-0.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                key={activeIndex}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 7, ease: "linear" }}
                className="h-full bg-red-500"
              />
            </div>
            <span>0{FEATURED_GAMES.length}</span>
          </div>
        </div>

        {/* Central Core Layout: Desktop 2-column, Mobile vertical */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
          {/* Left Column: Typography and Discovery CTAs */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div className="space-y-2">
              <span className="font-rajdhani text-sm md:text-base font-bold uppercase tracking-[0.3em] text-red-400">
                {currentGame.genre} • {currentGame.archetypeMatch}
              </span>
              <h1 className="font-orbitron font-black text-white leading-none tracking-wider text-[clamp(2.2rem,6vw,5.2rem)] drop-shadow-[0_0_35px_rgba(255,255,255,0.2)]">
                {currentGame.title}
              </h1>
              <p className="font-inter text-gray-300 text-sm md:text-lg max-w-xl leading-relaxed pt-2">
                {currentGame.tagline}. GameAtlas reads your taste profile and predicts what you should play next with crystal clarity.
              </p>
            </div>

            {/* Dynamic Signal Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-orbitron text-xs font-bold">
                <Star size={12} fill="currentColor" /> {currentGame.rating} Community Score
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 font-rajdhani text-xs font-bold uppercase tracking-wider">
                <Sparkles size={12} className="text-red-400" /> {currentGame.dnaScore}% DNA Match
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-rajdhani text-xs font-semibold uppercase">
                <Trophy size={12} className="text-gray-400" /> {currentGame.stats.awards}
              </div>
            </div>

            {/* CTA Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link href="/signup">
                <button className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-rajdhani uppercase tracking-widest font-bold text-sm rounded-xl transition-all shadow-[0_0_30px_rgba(239,68,68,0.5)] flex items-center justify-center gap-2 group cursor-pointer">
                  <Play size={16} fill="currentColor" />
                  Discover My Games
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              <Link href={`/library/${currentGame.slug}`}>
                <button className="px-6 py-4 glass-panel hover:border-red-500/50 text-white font-rajdhani uppercase tracking-widest font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer">
                  Explore {currentGame.title}
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Featured Card Deck */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glass-panel border border-red-500/40 shadow-[0_20px_60px_rgba(139,0,0,0.4)]">
                <GameMedia
                  src={currentGame.coverImage}
                  alt={currentGame.title}
                  title={currentGame.title}
                  genre={currentGame.genre}
                  priority={true}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="font-rajdhani uppercase text-[10px] tracking-widest text-red-400 font-bold">Featured Spotlight</span>
                    <h4 className="font-orbitron font-bold text-white text-sm truncate">{currentGame.title}</h4>
                  </div>
                  <Link href={`/library/${currentGame.slug}`}>
                    <span className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-rajdhani uppercase text-xs font-bold tracking-wider transition-colors cursor-pointer">
                      Inspect
                    </span>
                  </Link>
                </div>
              </div>

              {/* Carousel Controls */}
              <div className="flex items-center justify-between mt-4 px-2">
                <div className="flex items-center gap-2">
                  {FEATURED_GAMES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`w-3 h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === activeIndex ? "w-8 bg-red-500" : "bg-white/20 hover:bg-white/40"
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveIndex((prev) => (prev - 1 + FEATURED_GAMES.length) % FEATURED_GAMES.length)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors cursor-pointer"
                    aria-label="Previous Featured Game"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setActiveIndex((prev) => (prev + 1) % FEATURED_GAMES.length)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors cursor-pointer"
                    aria-label="Next Featured Game"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Feature Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-8 border-t border-white/10">
          <div className="p-3 rounded-xl bg-white/3 border border-white/5">
            <span className="font-orbitron text-red-500 text-xs font-bold block mb-1">01. GAMING DNA</span>
            <p className="font-rajdhani text-gray-400 text-xs uppercase tracking-wider">Multi-dimensional taste profile that evolves as you play</p>
          </div>
          <div className="p-3 rounded-xl bg-white/3 border border-white/5">
            <span className="font-orbitron text-red-500 text-xs font-bold block mb-1">02. DISCOVERY</span>
            <p className="font-rajdhani text-gray-400 text-xs uppercase tracking-wider">Tailored picks from 100,000+ titles via IGDB</p>
          </div>
          <div className="p-3 rounded-xl bg-white/3 border border-white/5">
            <span className="font-orbitron text-red-500 text-xs font-bold block mb-1">03. CROSS-PLATFORM</span>
            <p className="font-rajdhani text-gray-400 text-xs uppercase tracking-wider">Unify Steam, Epic, PlayStation & Xbox activity</p>
          </div>
          <div className="p-3 rounded-xl bg-white/3 border border-white/5">
            <span className="font-orbitron text-red-500 text-xs font-bold block mb-1">04. NEXUS ARCADE</span>
            <p className="font-rajdhani text-gray-400 text-xs uppercase tracking-wider">Zero-download instant browser gaming whenever you want</p>
          </div>
        </div>
      </div>
    </section>
  );
}
