import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageTransition } from '@/components/shared/PageTransition';
import { usersApi, libraryApi, dnaApi, type UserProfile } from '@/lib/api';
import { GamerDNACard } from '@/components/GamerDNACard';
import { rankTierConfig } from '@/lib/communityData';
import { auth } from '@/lib/auth';
import { Link } from 'wouter';
import {
  Calendar, Clock, Trophy, Star, Gamepad2, Zap, Target, TrendingUp,
  Edit3, Save, X, Heart, CheckCircle, Shield
} from 'lucide-react';
import { ConnectedPlatformsWidget } from '@/components/platforms/ConnectedPlatformsWidget';
import { GameMedia } from '@/components/shared/GameMedia';

const rarityColors: Record<string, string> = {
  Common: '#9ca3af', Uncommon: '#22c55e', Rare: '#3b82f6',
  Epic: '#a855f7', Legendary: '#eab308',
};

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 20 });
  const [display, setDisplay] = useState(0);
  useEffect(() => { if (inView) motionVal.set(target); }, [inView, target, motionVal]);
  useEffect(() => spring.on('change', (v) => setDisplay(Math.round(v))), [spring]);
  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>;
}

function XPBar({ xp, xpToNext }: { xp: number; xpToNext: number }) {
  const pct = Math.min((xp / (xp + xpToNext)) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between font-rajdhani text-xs text-gray-400 uppercase tracking-wider">
        <span>{xp.toLocaleString()} XP</span>
        <span>{(xp + xpToNext).toLocaleString()} XP</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-red-700 via-red-500 to-orange-400"
          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ boxShadow: '0 0 10px rgba(239,68,68,0.5)' }} />
      </div>
      <p className="font-rajdhani text-xs text-gray-500">{xpToNext.toLocaleString()} XP to next level</p>
    </div>
  );
}

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [displayName, setDisplayName] = useState('');
  const queryClient = useQueryClient();
  const user = auth.getUser();

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => usersApi.getProfile(),
    staleTime: 30_000,
  });

  const { data: libraryData } = useQuery({
    queryKey: ['library'],
    queryFn: () => libraryApi.get(),
    staleTime: 30_000,
  });

  const { data: achData } = useQuery({
    queryKey: ['my-achievements'],
    queryFn: () => usersApi.getAchievements(),
    staleTime: 30_000,
  });

  const { data: dnaData } = useQuery({
    queryKey: ['gamer-dna'],
    queryFn: () => dnaApi.get(),
    staleTime: 120_000,
  });

  const updateMutation = useMutation({
    mutationFn: (updates: { bio?: string; displayName?: string }) => usersApi.updateProfile(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setEditing(false);
    },
  });

  const profile = profileData?.user;
  const library = libraryData?.library ?? [];
  const allAchievements = achData?.achievements ?? [];
  const unlocked = allAchievements.filter((a) => a.unlockedAt !== null);
  const rareAchievements = unlocked.filter((a) => ['Rare', 'Epic', 'Legendary'].includes(a.rarity)).slice(0, 6);
  const favorites = library.filter((e) => e.favorite).slice(0, 6);
  const totalPlaytime = library.reduce((acc, e) => acc + e.playtime, 0);

  useEffect(() => {
    if (profile) {
      setBio(profile.bio ?? '');
      setDisplayName(profile.displayName ?? profile.username);
    }
  }, [profile]);

  const rankTier = (profile?.rankTier ?? 'Bronze') as keyof typeof rankTierConfig;
  const rankConf = rankTierConfig[rankTier] ?? rankTierConfig['Bronze'];

  if (profileLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-16 h-16 border-4 border-red-900 border-t-red-500 rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!profile) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <p className="font-orbitron text-gray-400 text-xl">Profile not found.</p>
          <Link href="/login" className="mt-4 text-red-500 hover:text-red-400 font-rajdhani uppercase tracking-widest text-sm">Sign in →</Link>
        </div>
      </AppLayout>
    );
  }

  const avatarColor = profile.avatarColor ?? '#8B0000';
  const avatarInitials = (profile.displayName ?? profile.username).slice(0, 2).toUpperCase();

  return (
    <AppLayout>
      <PageTransition>
        <div className="space-y-10 pb-16 max-w-6xl mx-auto">

          {/* Hero Banner */}
          <div className="relative rounded-2xl overflow-hidden">
            <div className="h-40 w-full relative" style={{ background: `linear-gradient(135deg, ${avatarColor}40, #050505, #8B000020)` }}>
              <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 30% 50%, ${avatarColor}30, transparent 60%)` }} />
              <motion.div className="absolute inset-0 opacity-20"
                animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '30px 30px' }} />
            </div>

            <div className="px-6 md:px-10 pb-6">
              <div className="flex flex-col md:flex-row gap-6 md:items-end -mt-16 relative z-10">
                <motion.div
                  animate={{ boxShadow: [`0 0 30px ${avatarColor}40`, `0 0 60px ${avatarColor}70`, `0 0 30px ${avatarColor}40`] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-28 h-28 rounded-2xl flex items-center justify-center font-orbitron font-black text-3xl text-white border-4 shrink-0"
                  style={{ backgroundColor: avatarColor, borderColor: `${avatarColor}80` }}
                >
                  {avatarInitials}
                </motion.div>

                <div className="flex-1 pb-2">
                  {editing ? (
                    <input value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                      className="font-orbitron text-2xl font-black bg-black/50 border border-red-500/40 rounded-lg px-3 py-1 text-white mb-2 focus:outline-none w-full max-w-xs" />
                  ) : (
                    <h1 className="font-orbitron text-3xl font-black text-white tracking-widest">{profile.displayName ?? profile.username}</h1>
                  )}
                  <div className="flex items-center gap-3 mt-1">
                    <span className="font-rajdhani text-sm text-gray-400">@{profile.username}</span>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: rankConf.color, boxShadow: `0 0 6px ${rankConf.color}` }} />
                    <span className="font-rajdhani font-bold text-xs uppercase tracking-wider" style={{ color: rankConf.color }}>{profile.rankTier}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-2">
                  {editing ? (
                    <>
                      <button onClick={() => updateMutation.mutate({ bio, displayName })}
                        disabled={updateMutation.isPending}
                        className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-600 text-white font-rajdhani uppercase font-bold text-sm rounded-xl transition-colors disabled:opacity-50">
                        <Save size={14} /> Save
                      </button>
                      <button onClick={() => setEditing(false)} className="flex items-center gap-2 px-4 py-2 glass-panel hover:bg-white/10 text-gray-300 font-rajdhani uppercase font-bold text-sm rounded-xl">
                        <X size={14} /> Cancel
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 glass-panel hover:bg-white/10 text-white font-rajdhani uppercase font-bold text-sm rounded-xl transition-all">
                      <Edit3 size={14} /> Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="mt-5">
                {editing ? (
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell the Nexus about yourself..."
                    rows={2} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm font-inter text-white focus:outline-none focus:border-red-500/50 placeholder:text-gray-600 resize-none" />
                ) : (
                  <p className="font-inter text-gray-400 text-sm">{profile.bio || 'No bio yet.'}</p>
                )}
              </div>

              {/* XP Bar */}
              <div className="mt-5 max-w-md">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} className="text-yellow-400" />
                  <span className="font-orbitron text-sm font-bold text-white">Level {profile.level}</span>
                </div>
                <XPBar xp={profile.xp} xpToNext={profile.xpToNextLevel} />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Gamepad2, label: 'Games Owned', value: profile.gamesOwned, color: '#3b82f6' },
              { icon: Trophy, label: 'Achievements', value: profile.achievementsUnlocked, color: '#eab308' },
              { icon: Clock, label: 'Hours Played', value: Math.round(totalPlaytime || profile.totalPlaytime), color: '#22c55e', suffix: 'h' },
              { icon: Star, label: 'Reviews', value: profile.reviewsWritten, color: '#a855f7' },
            ].map(({ icon: Icon, label, value, color, suffix }) => (
              <div key={label} className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                </div>
                <div className="font-orbitron text-2xl font-black text-white mb-1">
                  <AnimatedCounter target={value} suffix={suffix ?? ''} />
                </div>
                <div className="font-rajdhani text-xs text-gray-500 uppercase tracking-wider font-bold">{label}</div>
              </div>
            ))}
          </div>

          {dnaData?.dna && (
            <div className="max-w-2xl">
              <GamerDNACard dna={dnaData.dna} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Favorite Games */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="font-orbitron text-xl font-black text-white tracking-widest border-l-4 border-red-600 pl-4 uppercase mb-5 flex items-center gap-3">
                  <Heart size={18} className="text-red-500" /> Favorite Games
                </h2>
                {favorites.length === 0 ? (
                  <div className="glass-panel rounded-2xl p-10 text-center">
                    <Heart size={32} className="text-gray-700 mx-auto mb-3" />
                    <p className="font-rajdhani text-gray-500 uppercase tracking-wider">No favorites yet — heart games in your library!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {favorites.map((entry) => (
                      <Link key={entry.id} href={`/library/${entry.game?.slug}`}>
                        <motion.div whileHover={{ y: -4 }} className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10 hover:border-red-500/40 cursor-pointer transition-all">
                          <GameMedia
                            src={entry.game?.coverImage}
                            alt={entry.game?.title || 'Game'}
                            title={entry.game?.title}
                            genre={entry.game?.genre}
                            aspectRatio="3/4"
                            className="w-full h-full opacity-70 group-hover:opacity-50 group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                            <Heart size={12} fill="#ef4444" className="text-red-500 mb-1" />
                            <p className="font-orbitron text-xs font-bold text-white truncate">{entry.game?.title}</p>
                            <p className="font-rajdhani text-[10px] text-gray-400 uppercase">{entry.playtime.toFixed(0)}h played</p>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Rare Achievements */}
              {rareAchievements.length > 0 && (
                <div>
                  <h2 className="font-orbitron text-xl font-black text-white tracking-widest border-l-4 border-red-600 pl-4 uppercase mb-5 flex items-center gap-3">
                    <Trophy size={18} className="text-yellow-500" /> Rare Achievements
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {rareAchievements.map((ach) => {
                      const color = rarityColors[ach.rarity] ?? '#9ca3af';
                      return (
                        <motion.div key={ach.id} whileHover={{ x: 4 }}
                          className="flex items-center gap-4 p-4 rounded-xl border transition-all"
                          style={{ borderColor: `${color}30`, backgroundColor: `${color}08` }}>
                          <div className="w-12 h-12 rounded-xl overflow-hidden border shrink-0 flex items-center justify-center bg-black/50"
                            style={{ borderColor: `${color}40` }}>
                            {ach.iconUrl ? <img src={ach.iconUrl} alt={ach.title} className="w-full h-full object-cover" /> : <Trophy size={20} style={{ color }} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-rajdhani font-bold text-white truncate">{ach.title}</p>
                            <p className="font-inter text-xs text-gray-500 truncate">{ach.gameTitle ?? 'Game Achievement'}</p>
                          </div>
                          <span className="font-orbitron text-xs font-bold shrink-0" style={{ color }}>+{ach.xpReward}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <div className="glass-panel rounded-2xl border border-white/5 p-6">
                <h3 className="font-orbitron text-sm font-black text-white tracking-widest uppercase mb-5 flex items-center gap-2">
                  <Shield size={14} className="text-red-500" /> Player Card
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Rank', value: profile.rankTier, color: rankConf.color },
                    { label: 'Level', value: `${profile.level}`, color: '#fff' },
                    { label: 'Member Since', value: profile.joinDate ? new Date(profile.joinDate).getFullYear().toString() : '–', color: '#fff' },
                    { label: 'Last Active', value: profile.lastSeen ? new Date(profile.lastSeen).toLocaleDateString() : 'Recently', color: '#fff' },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <span className="font-rajdhani text-xs text-gray-500 uppercase tracking-wider">{row.label}</span>
                      <span className="font-rajdhani font-bold text-sm" style={{ color: row.color }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel rounded-2xl border border-white/5 p-6">
                <h3 className="font-orbitron text-sm font-black text-white tracking-widest uppercase mb-5 flex items-center gap-2">
                  <Target size={14} className="text-red-500" /> Completion Rate
                </h3>
                <div className="text-center">
                  <div className="font-orbitron text-4xl font-black text-white mb-2">
                    {allAchievements.length > 0 ? Math.round((unlocked.length / allAchievements.length) * 100) : 0}%
                  </div>
                  <p className="font-rajdhani text-gray-500 text-xs uppercase tracking-wider">{unlocked.length} / {allAchievements.length} achievements</p>
                  <div className="mt-3 h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full bg-gradient-to-r from-red-700 to-orange-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${allAchievements.length > 0 ? (unlocked.length / allAchievements.length) * 100 : 0}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }} />
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-2xl border border-white/5 p-6">
                <h3 className="font-orbitron text-sm font-black text-white tracking-widest uppercase mb-5 flex items-center gap-2">
                  <TrendingUp size={14} className="text-red-500" /> Library Breakdown
                </h3>
                {[
                  { label: 'Completed', count: library.filter(e => e.status === 'completed').length, color: '#22c55e' },
                  { label: 'Playing', count: library.filter(e => e.status === 'playing').length, color: '#3b82f6' },
                  { label: 'Wishlist', count: library.filter(e => e.status === 'wishlist').length, color: '#eab308' },
                  { label: 'Paused', count: library.filter(e => e.status === 'paused').length, color: '#f97316' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-rajdhani text-xs text-gray-400 uppercase tracking-wider">{item.label}</span>
                    </div>
                    <span className="font-orbitron text-sm font-bold text-white">{item.count}</span>
                  </div>
                ))}
              </div>

              {/* Connected Platforms */}
              <ConnectedPlatformsWidget />
            </div>
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
