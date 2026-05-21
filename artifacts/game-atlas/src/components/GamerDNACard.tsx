import { motion } from "framer-motion";
import type { GamerDNA } from "@/lib/api";

const RARITY_COLORS: Record<string, string> = {
  Common: "#9ca3af",
  Uncommon: "#22c55e",
  Rare: "#3b82f6",
  Epic: "#a855f7",
  Legendary: "#eab308",
};

interface Props {
  dna: GamerDNA;
  compact?: boolean;
}

export function GamerDNACard({ dna, compact = false }: Props) {
  const rarityColor = RARITY_COLORS[dna.rarity] ?? "#9ca3af";
  const topGenres = Object.entries(dna.genreAffinity)
    .sort((a, b) => b[1] - a[1])
    .slice(0, compact ? 3 : 5);
  const maxGenreCount = Math.max(...topGenres.map(([, v]) => v), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-xl overflow-hidden border bg-[rgba(5,5,5,0.8)] backdrop-blur-xl"
      style={{ borderColor: `${rarityColor}40` }}
    >
      <div
        className="absolute top-0 right-0 w-72 h-72 rounded-full blur-[120px] pointer-events-none opacity-15"
        style={{ backgroundColor: rarityColor }}
      />
      <div
        className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-[80px] pointer-events-none opacity-10"
        style={{ backgroundColor: rarityColor }}
      />

      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="font-rajdhani text-xs uppercase tracking-[0.2em] font-bold"
                style={{ color: rarityColor }}
              >
                Gamer DNA
              </span>
              <span
                className="px-2 py-0.5 rounded font-rajdhani font-bold text-[10px] uppercase tracking-wider"
                style={{
                  backgroundColor: `${rarityColor}18`,
                  color: rarityColor,
                  border: `1px solid ${rarityColor}40`,
                }}
              >
                {dna.rarity}
              </span>
            </div>
            <h3
              className="font-orbitron font-black tracking-widest text-white"
              style={{
                fontSize: compact ? "1.2rem" : "1.6rem",
                textShadow: `0 0 20px ${rarityColor}50`,
              }}
            >
              {dna.archetype.toUpperCase()}
            </h3>
            {!compact && (
              <p className="font-inter text-gray-400 text-sm mt-2 leading-relaxed max-w-sm">
                {dna.description}
              </p>
            )}
          </div>
          <div className="text-4xl shrink-0 ml-4">{dna.icon}</div>
        </div>

        {topGenres.length > 0 && (
          <div className="mb-5">
            <p className="font-rajdhani uppercase text-[10px] tracking-[0.2em] text-gray-500 mb-3">
              Genre Affinity
            </p>
            <div className="space-y-2">
              {topGenres.map(([genre, count]) => (
                <div key={genre}>
                  <div className="flex justify-between font-rajdhani text-xs mb-1">
                    <span className="text-gray-400">{genre}</span>
                    <span style={{ color: rarityColor }}>
                      {count} {count === 1 ? "game" : "games"}
                    </span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / maxGenreCount) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: rarityColor, boxShadow: `0 0 8px ${rarityColor}60` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!compact && (
          <div>
            <p className="font-rajdhani uppercase text-[10px] tracking-[0.2em] text-gray-500 mb-3">
              Playstyle Breakdown
            </p>
            <div className="grid grid-cols-5 gap-2">
              {dna.playstyleBreakdown.map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="h-14 bg-white/5 rounded relative overflow-hidden mb-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(value, 4)}%` }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                      className="absolute bottom-0 w-full rounded"
                      style={{
                        backgroundColor: `${rarityColor}70`,
                        boxShadow: `0 0 10px ${rarityColor}40`,
                      }}
                    />
                  </div>
                  <p className="font-rajdhani text-gray-500 text-[9px] uppercase tracking-wider leading-tight">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {compact && (
          <p className="font-inter text-gray-500 text-xs mt-2 line-clamp-2">{dna.description}</p>
        )}
      </div>
    </motion.div>
  );
}
