import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageTransition } from '@/components/shared/PageTransition';
import { leaderboardApi, type LeaderboardPlayer } from '@/lib/api';
import { rankTierConfig } from '@/lib/communityData';
import { auth } from '@/lib/auth';
import { Crown, Trophy, TrendingUp, Globe, Users, Shield, Clock, Star } from 'lucide-react';

const rankIcons: Record<number, { icon: React.ElementType; color: string }> = {
  1: { icon: Crown, color: '#eab308' },
  2: { icon: Trophy, color: '#c0c0c0' },
  3: { icon: Trophy, color: '#cd7f32' },
};

function initials(player: LeaderboardPlayer): string {
  return (player.displayName ?? player.username).slice(0, 2).toUpperCase();
}

function PodiumCard({ player, position }: { player: LeaderboardPlayer; position: 1 | 2 | 3 }) {
  const rankTier = (player.rankTier ?? 'Bronze') as keyof typeof rankTierConfig;
  const rankConf = rankTierConfig[rankTier] ?? rankTierConfig['Bronze'];
  const heights = { 1: 'h-52', 2: 'h-44', 3: 'h-40' };
  const sizes = { 1: 'w-24 h-24', 2: 'w-20 h-20', 3: 'w-18 h-18' };
  const crownColor = { 1: '#eab308', 2: '#c0c0c0', 3: '#cd7f32' };
  const avatarColor = player.avatarColor ?? '#8B0000';

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: position * 0.15, type: 'spring', stiffness: 80 }}
      className={`relative flex flex-col items-center ${position === 1 ? '-mt-8' : ''}`}>
      <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="mb-3">
        <Crown size={position === 1 ? 24 : position === 2 ? 20 : 18} style={{ color: crownColor[position], filter: `drop-shadow(0 0 8px ${crownColor[position]})` }} />
      </motion.div>

      <div className="relative mb-4">
        <motion.div className={`${sizes[position]} rounded-2xl flex items-center justify-center font-orbitron font-black text-white text-xl`}
          style={{ background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}88)`, boxShadow: `0 0 30px ${avatarColor}60` }}
          animate={{ boxShadow: [`0 0 20px ${avatarColor}40`, `0 0 50px ${avatarColor}70`, `0 0 20px ${avatarColor}40`] }}
          transition={{ duration: 2.5, repeat: Infinity }}>
          {initials(player)}
        </motion.div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-orbitron font-black text-sm border-2"
          style={{ backgroundColor: '#050505', borderColor: crownColor[position], color: crownColor[position], boxShadow: `0 0 12px ${crownColor[position]}80` }}>
          {position}
        </div>
      </div>

      <div className={`w-full ${heights[position]} rounded-t-2xl flex flex-col items-center pt-4 px-3 relative overflow-hidden border border-white/10`}
        style={{ background: `linear-gradient(to bottom, ${avatarColor}20, ${avatarColor}05)`, borderColor: `${avatarColor}30` }}>
        <p className="font-orbitron font-black text-white text-sm tracking-wider mb-1 z-10 text-center truncate w-full">{player.displayName ?? player.username}</p>
        <p className="font-orbitron text-lg font-black z-10" style={{ color: rankConf.color }}>{player.score.toLocaleString()}</p>
        <span className="font-rajdhani text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mt-1 z-10" style={{ color: rankConf.color, backgroundColor: `${rankConf.color}20` }}>{player.rankTier}</span>
        <p className="font-rajdhani text-xs text-gray-400 mt-1 z-10">{player.achievementsUnlocked} achievements</p>
      </div>
    </motion.div>
  );
}

function LeaderboardRow({ player, index, isCurrentUser }: { player: LeaderboardPlayer; index: number; isCurrentUser: boolean }) {
  const rankTier = (player.rankTier ?? 'Bronze') as keyof typeof rankTierConfig;
  const rankConf = rankTierConfig[rankTier] ?? rankTierConfig['Bronze'];
  const avatarColor = player.avatarColor ?? '#8B0000';

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
      className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${isCurrentUser ? 'border-red-500/40 bg-red-950/20 shadow-[0_0_20px_rgba(139,0,0,0.15)]' : 'border-transparent hover:border-white/10 hover:bg-white/3'}`}>
      <div className="w-8 shrink-0 text-center">
        {rankIcons[player.rank] ? (() => {
          const RankIcon = rankIcons[player.rank].icon;
          return <RankIcon size={18} style={{ color: rankIcons[player.rank].color, margin: 'auto' }} />;
        })() : <span className="font-orbitron font-bold text-gray-500 text-sm">#{player.rank}</span>}
      </div>

      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-orbitron font-bold text-sm text-white shrink-0"
        style={{ backgroundColor: avatarColor, boxShadow: isCurrentUser ? `0 0 15px ${avatarColor}60` : 'none' }}>
        {initials(player)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`font-rajdhani font-bold text-sm ${isCurrentUser ? 'text-red-300' : 'text-white'}`}>{player.displayName ?? player.username}</span>
          {isCurrentUser && <span className="font-rajdhani text-[9px] font-bold text-red-400 bg-red-950/40 border border-red-500/30 px-1.5 py-0.5 rounded uppercase tracking-wider">You</span>}
        </div>
        <span className="font-orbitron text-[10px] font-bold" style={{ color: rankConf.color }}>{player.rankTier.toUpperCase()}</span>
      </div>

      <div className="hidden sm:flex items-center gap-6 shrink-0">
        <div className="text-center">
          <p className="font-orbitron font-bold text-white text-sm">{player.score.toLocaleString()}</p>
          <p className="font-rajdhani text-[10px] text-gray-500 uppercase tracking-wider">Score</p>
        </div>
        <div className="text-center hidden md:block">
          <p className="font-orbitron font-bold text-white text-sm">{player.achievementsUnlocked}</p>
          <p className="font-rajdhani text-[10px] text-gray-500 uppercase tracking-wider">Achievements</p>
        </div>
        <div className="text-center hidden lg:block">
          <p className="font-orbitron font-bold text-white text-sm">{player.totalPlaytime}h</p>
          <p className="font-rajdhani text-[10px] text-gray-500 uppercase tracking-wider">Playtime</p>
        </div>
        <div className="text-center hidden xl:block">
          <p className="font-rajdhani font-bold text-gray-300 text-xs truncate max-w-[80px]">{player.favoriteGame ?? 'N/A'}</p>
          <p className="font-rajdhani text-[10px] text-gray-500 uppercase tracking-wider">Top Game</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Leaderboards() {
  const user = auth.getUser();

  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => leaderboardApi.get(),
    staleTime: 60_000,
  });

  const leaderboard = data?.leaderboard ?? [];
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  const rankTiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Legendary'];

  return (
    <AppLayout>
      <PageTransition>
        <div className="space-y-8 pb-16">
          <div>
            <h1 className="font-orbitron text-3xl md:text-4xl font-black text-white tracking-widest border-l-4 border-red-600 pl-4 uppercase">Leaderboards</h1>
            <p className="font-rajdhani text-gray-400 uppercase tracking-widest mt-1 pl-5">Prove your dominance across the multiverse</p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {rankTiers.map((tier) => {
              const conf = rankTierConfig[tier as keyof typeof rankTierConfig];
              if (!conf) return null;
              return (
                <div key={tier} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border shrink-0"
                  style={{ borderColor: `${conf.color}40`, backgroundColor: `${conf.color}10` }}>
                  <Shield size={11} style={{ color: conf.color }} />
                  <span className="font-rajdhani text-xs font-bold uppercase tracking-wider" style={{ color: conf.color }}>{tier}</span>
                </div>
              );
            })}
          </div>

          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="animate-pulse bg-white/5 rounded-xl h-16" />)}</div>
          ) : leaderboard.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center">
              <TrendingUp size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="font-orbitron text-gray-400 text-lg">No rankings yet.</p>
              <p className="font-rajdhani text-gray-600 text-sm mt-2">Be the first to earn achievements and climb the leaderboard!</p>
            </div>
          ) : (
            <>
              {top3.length >= 3 && (
                <section className="glass-panel rounded-2xl border border-white/5 p-6 md:p-10 relative overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(139,0,0,0.1), transparent 60%)' }} />
                  <h2 className="font-orbitron text-lg font-black text-white tracking-widest mb-8 text-center uppercase">Hall of Champions</h2>
                  <div className="flex items-end justify-center gap-4 md:gap-8">
                    <PodiumCard player={top3[1]} position={2} />
                    <PodiumCard player={top3[0]} position={1} />
                    <PodiumCard player={top3[2]} position={3} />
                  </div>
                </section>
              )}

              <div className="px-4 flex items-center gap-4 text-gray-600">
                <div className="w-8 text-center"><span className="font-rajdhani text-[10px] uppercase tracking-wider">Rank</span></div>
                <div className="w-10" />
                <div className="flex-1"><span className="font-rajdhani text-[10px] uppercase tracking-wider">Player</span></div>
                <div className="hidden sm:flex items-center gap-6 shrink-0">
                  <div className="w-16 text-center"><span className="font-rajdhani text-[10px] uppercase tracking-wider">Score</span></div>
                  <div className="w-16 text-center hidden md:block"><span className="font-rajdhani text-[10px] uppercase tracking-wider">Achiev.</span></div>
                  <div className="w-16 text-center hidden lg:block"><span className="font-rajdhani text-[10px] uppercase tracking-wider">Playtime</span></div>
                  <div className="w-24 text-center hidden xl:block"><span className="font-rajdhani text-[10px] uppercase tracking-wider">Top Game</span></div>
                </div>
              </div>

              <AnimatePresence>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                  {rest.map((player, i) => (
                    <LeaderboardRow key={player.id} player={player} index={i} isCurrentUser={user?.id === player.id} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </PageTransition>
    </AppLayout>
  );
}
