import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Star, Plus, Check, Clock, ExternalLink, Flame, Gamepad2 } from "lucide-react";
import { SiSteam, SiEpicgames, SiPlaystation } from "react-icons/si";
import { GameMedia } from "./GameMedia";
import { cn } from "@/lib/utils";
import type { Game } from "@/lib/api";
import type { IGDBGame } from "@/lib/igdb";

export type GameCardVariant = "standard" | "compact" | "featured" | "horizontal" | "recommendation";

export interface UnifiedGameCardProps {
  game: {
    id: number;
    slug: string;
    title?: string;
    name?: string;
    coverImage?: string | null;
    cover?: string | null;
    genre?: string;
    genres?: string[];
    platform?: string;
    platforms?: string[];
    rating?: number | null;
    playtime?: number;
    releaseYear?: number;
    firstReleaseDate?: string | null;
    description?: string;
    summary?: string | null;
    dnaMatch?: number;
    affinityReason?: string;
  };
  variant?: GameCardVariant;
  inLibrary?: boolean;
  onAddToLibrary?: (id: number) => void;
  className?: string;
}

export function PlatformBadge({ platform, className = "" }: { platform?: string; className?: string }) {
  if (!platform) return null;
  const p = platform.toLowerCase();
  if (p.includes("steam") || p.includes("pc")) return <SiSteam className={cn("text-[#66c0f4]", className)} title="Steam / PC" />;
  if (p.includes("epic")) return <SiEpicgames className={cn("text-white", className)} title="Epic Games" />;
  if (p.includes("playstation") || p.includes("ps4") || p.includes("ps5")) return <SiPlaystation className={cn("text-[#003791]", className)} title="PlayStation" />;
  if (p.includes("xbox")) return <span title="Xbox"><Gamepad2 className={cn("text-[#107c10]", className)} /></span>;
  if (p.includes("switch") || p.includes("nintendo")) return <span title="Nintendo Switch"><Gamepad2 className={cn("text-[#e60012]", className)} /></span>;
  return null;
}

export function UnifiedGameCard({
  game,
  variant = "standard",
  inLibrary = false,
  onAddToLibrary,
  className = "",
}: UnifiedGameCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const title = game.title || game.name || "Untitled Game";
  const coverUrl = game.coverImage || game.cover;
  const genre = game.genre || game.genres?.[0] || "Action";
  const platform = game.platform || game.platforms?.[0] || "Multi-Platform";
  const rawRating = game.rating ?? 0;
  // IGDB ratings are 0-100, local ratings are 0-5
  const normalizedRating = rawRating > 5 ? rawRating / 20 : rawRating;
  const summary = game.description || game.summary || "";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (variant !== "standard") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * 8, y: -x * 8 });
  };

  const handleMouseLeave = () => {
    if (variant !== "standard") return;
    setTilt({ x: 0, y: 0 });
  };

  // Compact variant (e.g. Search popover or quick sidebar rows)
  if (variant === "compact") {
    return (
      <Link href={`/library/${game.slug}`}>
        <div className={cn("flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group border border-transparent hover:border-red-500/30", className)}>
          <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0">
            <GameMedia src={coverUrl} alt={title} title={title} genre={genre} aspectRatio="3/4" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-orbitron font-bold text-white text-xs truncate group-hover:text-red-400 transition-colors">{title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-rajdhani text-[10px] text-gray-400 uppercase tracking-wider">{genre}</span>
              {normalizedRating > 0 && (
                <span className="flex items-center gap-1 font-orbitron text-[10px] text-yellow-400">
                  <Star size={9} fill="currentColor" /> {normalizedRating.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Horizontal variant (e.g. Dashboard lists / Search Results)
  if (variant === "horizontal") {
    return (
      <div className={cn("group glass-panel rounded-2xl border border-white/5 hover:border-red-500/40 overflow-hidden transition-all duration-300 flex flex-col sm:flex-row hover:shadow-[0_4px_30px_rgba(139,0,0,0.2)]", className)}>
        <div className="sm:w-36 md:w-44 shrink-0 aspect-[16/9] sm:aspect-[3/4] relative overflow-hidden">
          <GameMedia src={coverUrl} alt={title} title={title} genre={genre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
            <PlatformBadge platform={platform} className="text-xs" />
            <span className="font-rajdhani text-[10px] text-gray-300 font-bold uppercase">{genre}</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <Link href={`/library/${game.slug}`}>
                <h3 className="font-orbitron font-black text-white text-base md:text-lg group-hover:text-red-400 transition-colors cursor-pointer truncate">
                  {title}
                </h3>
              </Link>
              {normalizedRating > 0 && (
                <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/30 px-2 py-0.5 rounded-full shrink-0">
                  <Star size={11} className="text-yellow-400" fill="currentColor" />
                  <span className="font-orbitron font-bold text-xs text-yellow-400">{normalizedRating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {game.dnaMatch && (
              <div className="flex items-center gap-2 mb-2">
                <span className="font-rajdhani text-xs font-bold text-red-400 uppercase tracking-widest px-2 py-0.5 bg-red-950/40 border border-red-500/30 rounded flex items-center gap-1">
                  <Flame size={12} /> {game.dnaMatch}% DNA Match
                </span>
                {game.affinityReason && <span className="font-inter text-xs text-gray-400 truncate">{game.affinityReason}</span>}
              </div>
            )}

            {summary && <p className="font-inter text-xs text-gray-400 line-clamp-2 mb-3">{summary}</p>}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/5 gap-3 mt-auto">
            <div className="flex items-center gap-3 text-gray-400 font-rajdhani text-xs font-semibold">
              {game.playtime !== undefined && (
                <span className="flex items-center gap-1"><Clock size={12} className="text-red-500" /> {game.playtime}h played</span>
              )}
              {game.releaseYear && <span>{game.releaseYear}</span>}
            </div>

            <div className="flex items-center gap-2">
              <Link href={`/library/${game.slug}`}>
                <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-rajdhani uppercase text-xs font-bold tracking-wider transition-colors">
                  Details
                </button>
              </Link>
              {onAddToLibrary && (
                <button
                  onClick={() => onAddToLibrary(game.id)}
                  disabled={inLibrary}
                  className={cn(
                    "px-3 py-1.5 rounded-lg font-rajdhani uppercase text-xs font-bold tracking-wider transition-all flex items-center gap-1",
                    inLibrary
                      ? "bg-green-950/40 text-green-400 border border-green-500/30 cursor-default"
                      : "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                  )}
                >
                  {inLibrary ? <><Check size={12} /> In Library</> : <><Plus size={12} /> Add</>}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard Card variant (Discover / Library grids)
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn("group relative flex flex-col rounded-2xl overflow-hidden glass-panel border border-white/5 hover:border-red-500/40 transition-all duration-300 hover:shadow-[0_10px_35px_rgba(139,0,0,0.25)]", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.15s ease-out",
      }}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <GameMedia
          src={coverUrl}
          alt={title}
          title={title}
          genre={genre}
          aspectRatio="3/4"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90 group-hover:opacity-60"
        />

        {/* Ambient Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
            <PlatformBadge platform={platform} className="text-xs" />
            <span className="font-rajdhani text-[10px] font-bold text-gray-200 uppercase tracking-wider">{genre}</span>
          </div>

          {normalizedRating > 0 && (
            <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
              <Star size={10} className="text-yellow-400" fill="currentColor" />
              <span className="font-orbitron font-bold text-[10px] text-white">{normalizedRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Gradient shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/20 to-transparent pointer-events-none" />

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2.5 p-4 bg-black/60 backdrop-blur-sm z-20">
          <Link href={`/library/${game.slug}`} className="w-full">
            <button className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-rajdhani uppercase text-xs font-bold tracking-widest rounded-lg transition-all shadow-[0_0_15px_rgba(239,68,68,0.5)]">
              View Profile
            </button>
          </Link>
          {onAddToLibrary && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToLibrary(game.id);
              }}
              disabled={inLibrary}
              className={cn(
                "w-full py-2 rounded-lg font-rajdhani uppercase text-xs font-bold tracking-widest transition-all flex items-center justify-center gap-1",
                inLibrary
                  ? "bg-green-900/40 text-green-400 border border-green-500/30 cursor-default"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
              )}
            >
              {inLibrary ? <><Check size={12} /> Saved</> : <><Plus size={12} /> Add to Library</>}
            </button>
          )}
        </div>
      </div>

      {/* Bottom info */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/library/${game.slug}`}>
            <h4 className="font-orbitron font-bold text-white text-xs sm:text-sm truncate group-hover:text-red-400 transition-colors cursor-pointer">
              {title}
            </h4>
          </Link>
          <div className="flex items-center justify-between text-[11px] font-rajdhani text-gray-400 uppercase tracking-wider mt-1">
            <span>{platform}</span>
            {game.releaseYear && <span>{game.releaseYear}</span>}
          </div>
        </div>

        {game.dnaMatch && (
          <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-rajdhani font-bold text-red-400 uppercase tracking-wider">
            <span>DNA Affinity</span>
            <span>{game.dnaMatch}%</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
