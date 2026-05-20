import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageTransition } from '@/components/shared/PageTransition';
import { usersApi, type Achievement } from '@/lib/api';
import { Trophy, Lock } from 'lucide-react';

const rarityColors: Record<string, string> = {
  Common: '#9ca3af',
  Uncommon: '#22c55e',
  Rare: '#3b82f6',
  Epic: '#a855f7',
  Legendary: '#eab308',
};

const ProgressRing = ({ percent, color, label, icon: Icon }: { percent: number; color: string; label: string; icon?: React.ElementType }) => {
  const [offset, setOffset] = useState(251.2);
  useEffect(() => {
    const timer = setTimeout(() => setOffset(251.2 - (percent / 100) * 251.2), 100);
    return () => clearTimeout(timer);
  }, [percent]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <circle cx="50" cy="50" r="40" fill="transparent" stroke={color} strokeWidth="6"
            strokeDasharray="251.2" strokeDashoffset={offset} strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          {Icon && <Icon size={16} color={color} className="mb-1 opacity-80" />}
          <span className="font-orbitron font-bold text-xl text-white">{Math.round(percent)}%</span>
        </div>
      </div>
      <span className="font-rajdhani font-bold uppercase tracking-widest text-xs text-gray-400 mt-2">{label}</span>
    </div>
  );
};

const RARITIES = ['All', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'] as const;
type RarityFilter = typeof RARITIES[number];

export default function Achievements() {
  const [filter, setFilter] = useState<RarityFilter>('All');

  const { data, isLoading } = useQuery({
    queryKey: ['my-achievements'],
    queryFn: () => usersApi.getAchievements(),
    staleTime: 30_000,
  });

  const allAchievements = data?.achievements ?? [];
  const unlocked = allAchievements.filter((a) => a.unlockedAt !== null);
  const totalXP = unlocked.reduce((acc, a) => acc + a.xpReward, 0);
  const completionRate = allAchievements.length > 0 ? (unlocked.length / allAchievements.length) * 100 : 0;
  const legendaryCount = unlocked.filter((a) => a.rarity === 'Legendary').length;

  const achievements = filter === 'All' ? allAchievements : allAchievements.filter((a) => a.rarity === filter);

  return (
    <AppLayout>
      <PageTransition>
        <div className="space-y-12 pb-16">
          {/* Stats Header */}
          <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-end">
            <div>
              <h1 className="font-orbitron text-4xl font-black text-white tracking-widest mb-2 border-l-4 border-red-600 pl-4 uppercase">
                Achievement Nexus
              </h1>
              <p className="font-rajdhani text-gray-400 font-semibold tracking-wider pl-5 uppercase">
                Track your legacy across the multiverse
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="glass-panel px-4 py-2 rounded-lg border-l-2 border-l-red-500">
                <div className="font-rajdhani text-[10px] text-gray-400 uppercase tracking-widest font-bold">Total Unlocked</div>
                <div className="font-orbitron text-xl text-white font-bold">{unlocked.length} / {allAchievements.length}</div>
              </div>
              <div className="glass-panel px-4 py-2 rounded-lg border-l-2 border-l-yellow-500">
                <div className="font-rajdhani text-[10px] text-gray-400 uppercase tracking-widest font-bold">Legendary</div>
                <div className="font-orbitron text-xl text-yellow-400 font-bold">{legendaryCount}</div>
              </div>
              <div className="glass-panel px-4 py-2 rounded-lg border-l-2 border-l-purple-500">
                <div className="font-rajdhani text-[10px] text-gray-400 uppercase tracking-widest font-bold">Total XP</div>
                <div className="font-orbitron text-xl text-purple-400 font-bold">{totalXP.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white/5 rounded-xl h-28" />
              ))}
            </div>
          )}

          {!isLoading && allAchievements.length > 0 && (
            <>
              {/* Progress Rings */}
              <div className="glass-panel rounded-2xl p-8 flex flex-wrap justify-around gap-8 border border-white/5 bg-gradient-to-br from-black/60 to-transparent">
                <ProgressRing percent={completionRate} color="#ef4444" label="Overall Completion" icon={Trophy} />
                <ProgressRing
                  percent={(unlocked.filter(a => a.rarity === 'Common').length / Math.max(1, allAchievements.filter(a => a.rarity === 'Common').length)) * 100}
                  color={rarityColors.Common} label="Common"
                />
                <ProgressRing
                  percent={(unlocked.filter(a => a.rarity === 'Rare').length / Math.max(1, allAchievements.filter(a => a.rarity === 'Rare').length)) * 100}
                  color={rarityColors.Rare} label="Rare"
                />
                <ProgressRing
                  percent={(unlocked.filter(a => a.rarity === 'Legendary').length / Math.max(1, allAchievements.filter(a => a.rarity === 'Legendary').length)) * 100}
                  color={rarityColors.Legendary} label="Legendary"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex gap-3 flex-wrap">
                {RARITIES.map((r) => (
                  <button key={r} onClick={() => setFilter(r)}
                    className={`px-4 py-2 rounded-full font-rajdhani font-bold uppercase tracking-wider text-xs transition-all flex items-center gap-2 ${filter === r ? 'bg-white/10 text-white border border-white/20 shadow-lg' : 'bg-black/40 border border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
                    {r !== 'All' && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: rarityColors[r], boxShadow: `0 0 5px ${rarityColors[r]}` }} />}
                    {r}
                  </button>
                ))}
              </div>

              {achievements.length === 0 ? (
                <div className="glass-panel rounded-2xl p-12 text-center">
                  <Trophy size={48} className="text-gray-700 mx-auto mb-4" />
                  <p className="font-orbitron text-gray-500 text-lg">No achievements in this category.</p>
                </div>
              ) : (
                /* Achievements Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((ach, i) => {
                    const isUnlocked = ach.unlockedAt !== null;
                    const color = rarityColors[ach.rarity] ?? '#9ca3af';
                    return (
                      <motion.div key={ach.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ delay: (i % 3) * 0.05 }}
                        className={`group relative p-4 rounded-xl border transition-all duration-300 flex items-start gap-4 ${isUnlocked ? 'bg-[rgba(13,13,13,0.8)] border-white/10 hover:border-white/30 backdrop-blur-md' : 'bg-[rgba(5,5,5,0.6)] border-transparent opacity-60 hover:opacity-80 grayscale hover:grayscale-0'}`}>
                        <div className="relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-white/10 bg-black flex items-center justify-center">
                          {ach.iconUrl
                            ? <img src={ach.iconUrl} alt={ach.title} className="w-full h-full object-cover" />
                            : <Trophy size={24} style={{ color: isUnlocked ? color : '#4b5563' }} />
                          }
                          {!isUnlocked && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                              <Lock size={20} className="text-gray-400" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`font-rajdhani font-bold text-lg truncate ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>{ach.title}</h4>
                            <span className="font-orbitron font-bold text-xs shrink-0" style={{ color }}>+{ach.xpReward} XP</span>
                          </div>
                          <p className="font-inter text-xs text-gray-500 mb-2 line-clamp-2 leading-snug">{ach.description}</p>
                          <div className="flex items-center justify-between mt-auto">
                            <span className="font-rajdhani text-[10px] uppercase font-bold tracking-widest text-red-500/80 truncate pr-2">{ach.gameTitle ?? 'Unknown Game'}</span>
                            <span className="font-rajdhani text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded shrink-0 border"
                              style={{ color: isUnlocked ? color : '#6b7280', borderColor: isUnlocked ? `${color}40` : '#374151', backgroundColor: isUnlocked ? `${color}10` : 'transparent' }}>
                              {ach.rarity}
                            </span>
                          </div>
                        </div>

                        {isUnlocked && (
                          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                            style={{ boxShadow: `inset 0 0 20px ${color}20, 0 0 20px ${color}10` }} />
                        )}
                        {ach.rarity === 'Legendary' && isUnlocked && (
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500/0 via-yellow-500/30 to-yellow-500/0 rounded-xl blur opacity-0 group-hover:opacity-100 animate-pulse pointer-events-none" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {!isLoading && allAchievements.length === 0 && (
            <div className="glass-panel rounded-2xl p-16 text-center">
              <Trophy size={56} className="text-gray-700 mx-auto mb-5" />
              <h3 className="font-orbitron text-2xl font-bold text-gray-400 mb-3">NO ACHIEVEMENTS YET</h3>
              <p className="font-inter text-gray-600 text-sm">Play games and complete challenges to earn achievements.</p>
            </div>
          )}
        </div>
      </PageTransition>
    </AppLayout>
  );
}
