import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Play, Trophy, Clock, Target, Gamepad2, ArrowRight, Users, Star, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { auth } from "@/lib/auth";
import { usersApi, libraryApi, gamesApi, recommendationsApi, dnaApi } from "@/lib/api";
import { ConnectedPlatformsWidget } from "@/components/platforms/ConnectedPlatformsWidget";

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-white/5 rounded ${className}`} />;
}

function generateWeeklyChart(totalPlaytime: number) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weights = [0.1, 0.12, 0.15, 0.1, 0.18, 0.2, 0.15];
  return days.map((day, i) => ({
    day,
    hours: parseFloat((totalPlaytime * weights[i]).toFixed(1)),
  }));
}

export default function Dashboard() {
  const user = auth.getUser();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => usersApi.getProfile(),
    staleTime: 30_000,
  });

  const { data: libraryData, isLoading: libraryLoading } = useQuery({
    queryKey: ["library"],
    queryFn: () => libraryApi.get(),
    staleTime: 30_000,
  });

  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ["trending"],
    queryFn: () => gamesApi.trending(),
    staleTime: 60_000,
  });

  const { data: recsData } = useQuery({
    queryKey: ["recommendations"],
    queryFn: () => recommendationsApi.forMe(),
    staleTime: 60_000,
  });

  const { data: becauseData } = useQuery({
    queryKey: ["because-played"],
    queryFn: () => recommendationsApi.becausePlayed(),
    staleTime: 60_000,
  });

  const { data: dnaData } = useQuery({
    queryKey: ["gamer-dna"],
    queryFn: () => dnaApi.get(),
    staleTime: 120_000,
  });

  const profile = profileData?.user;
  const stats = profile ? {
    totalPlaytime: profile.totalPlaytime,
    gamesInLibrary: profile.gamesOwned,
    achievementsUnlocked: profile.achievementsUnlocked,
    gamesCompleted: profile.reviewsWritten,
  } : undefined;
  const library = libraryData?.library ?? [];
  const trendingGames = trendingData?.games ?? [];

  const currentlyPlaying = library
    .filter((e) => e.status === "playing" && e.game)
    .slice(0, 3);

  const weeklyChart = generateWeeklyChart(stats?.totalPlaytime ?? 0);

  const displayName = profileData?.user?.displayName ?? profileData?.user?.username ?? user?.displayName ?? user?.username ?? "PLAYER";

  return (
    <AppLayout>
      <div className="space-y-8 animate-in fade-in duration-500 pb-12">

        {/* Hero Welcome */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 glass-panel-red p-6 md:p-8 rounded-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-red-600/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            <h2 className="font-rajdhani text-red-500 uppercase tracking-widest font-bold mb-2">Nexus Terminal</h2>
            <h1 className="font-orbitron text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              WELCOME BACK,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
                {displayName.toUpperCase()}
              </span>
            </h1>
            <div className="flex items-center gap-4 mt-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/40 border border-red-500/50 rounded font-rajdhani text-sm font-bold text-red-300 shadow-[0_0_10px_rgba(139,0,0,0.3)]">
                LVL {profileData?.user?.level ?? user?.level ?? 1} {profileData?.user?.rankTier ?? user?.rankTier ?? "RECRUIT"}
              </span>
              <span className="font-inter text-gray-400 text-sm">
                Total Playtime: {stats ? `${stats.totalPlaytime.toFixed(0)}h` : "—"}
              </span>
            </div>
          </div>
          <div className="relative z-10 font-rajdhani text-right hidden md:block">
            <div className="text-3xl text-white font-bold tracking-wider">
              {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
            <div className="text-red-500 uppercase tracking-widest text-sm">
              {time.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {profileLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <SkeletonBlock key={i} className="h-24 rounded-lg" />
              ))
            : [
                { label: "Total Games", value: stats?.gamesInLibrary ?? 0, icon: Gamepad2 },
                { label: "Total Playtime", value: `${(stats?.totalPlaytime ?? 0).toFixed(0)}h`, icon: Clock },
                { label: "Achievements", value: stats?.achievementsUnlocked ?? 0, icon: Trophy },
                { label: "Completed", value: stats?.gamesCompleted ?? 0, icon: Target },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel p-5 rounded-lg border-l-2 border-l-transparent hover:border-l-red-500 hover:bg-white/5 transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-rajdhani uppercase text-gray-400 tracking-wider text-sm font-semibold">{stat.label}</span>
                    <stat.icon size={18} className="text-red-500 opacity-70 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(255,42,42,0.8)] transition-all" />
                  </div>
                  <div className="font-orbitron text-3xl font-bold text-white group-hover:text-red-100 transition-colors">
                    {stat.value}
                  </div>
                </motion.div>
              ))}
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">

            {/* Continue Playing */}
            <section>
              <div className="flex justify-between items-end mb-4">
                <h3 className="font-orbitron text-xl font-bold tracking-widest text-white border-l-4 border-red-600 pl-3">CONTINUE PLAYING</h3>
                <Link href="/library" className="font-rajdhani text-red-500 hover:text-red-400 text-sm uppercase tracking-widest flex items-center gap-1">
                  View All <ArrowRight size={14} />
                </Link>
              </div>
              {libraryLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => <SkeletonBlock key={i} className="h-48 rounded-lg" />)}
                </div>
              ) : currentlyPlaying.length === 0 ? (
                <div className="glass-panel rounded-lg p-8 text-center">
                  <Gamepad2 size={32} className="text-red-500 mx-auto mb-3 opacity-50" />
                  <p className="font-rajdhani text-gray-400 text-lg">No games in progress.</p>
                  <Link href="/discover" className="inline-block mt-3 text-red-500 hover:text-red-400 font-rajdhani uppercase text-sm tracking-widest">
                    Discover Games →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentlyPlaying.map((entry) => (
                    <Link key={entry.id} href={`/library/${entry.game!.slug}`}>
                      <motion.div
                        whileHover={{ y: -5 }}
                        className="group relative h-48 rounded-lg overflow-hidden border border-white/10 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(139,0,0,0.3)] transition-all cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-black/60 z-10 group-hover:bg-black/40 transition-colors" />
                        <img
                          src={entry.game!.coverImage}
                          alt={entry.game!.title}
                          className="absolute inset-0 w-full h-full object-cover blur-sm group-hover:blur-none transition-all duration-500 scale-110 group-hover:scale-100"
                        />
                        <div className="absolute inset-0 z-20 p-4 flex flex-col justify-end">
                          <span className="font-rajdhani text-xs text-red-400 uppercase font-bold mb-1 tracking-wider">
                            {entry.playtime.toFixed(0)}h played
                          </span>
                          <h4 className="font-orbitron font-bold text-lg text-white mb-3 truncate">{entry.game!.title}</h4>
                          <button className="w-full py-2 bg-red-600/80 hover:bg-red-600 backdrop-blur text-white font-rajdhani uppercase text-sm font-bold tracking-widest rounded flex items-center justify-center gap-2 transition-colors">
                            <Play size={14} fill="currentColor" /> Continue
                          </button>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Playtime Chart */}
            <section className="glass-panel rounded-lg p-5">
              <h3 className="font-orbitron text-lg font-bold tracking-widest text-white mb-6 border-l-4 border-red-600 pl-3">
                WEEKLY PLAYTIME ESTIMATE
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyChart} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <XAxis dataKey="day" stroke="#666" tick={{ fontFamily: "Rajdhani", fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis stroke="#666" tick={{ fontFamily: "Rajdhani", fontSize: 12 }} tickLine={false} axisLine={false} />
                    <Tooltip
                      cursor={{ fill: "rgba(255,255,255,0.05)" }}
                      contentStyle={{ backgroundColor: "rgba(5,5,5,0.9)", border: "1px solid rgba(139,0,0,0.5)", borderRadius: "4px", fontFamily: "Rajdhani" }}
                      itemStyle={{ color: "#fff" }}
                      formatter={(v: number) => [`${v}h`, "Hours"]}
                    />
                    <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                      {weeklyChart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(0, 100%, ${30 + (entry.hours / Math.max(...weeklyChart.map(d => d.hours), 1)) * 40}%)`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
            {/* Connected Gaming Platforms */}
            <ConnectedPlatformsWidget />
          </div>

          <div className="space-y-6">
            {/* Trending Games */}
            <section className="glass-panel rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-orbitron text-lg font-bold tracking-widest text-white border-l-4 border-red-600 pl-3">TRENDING</h3>
                <Link href="/discover" className="font-rajdhani text-red-500 hover:text-red-400 text-xs uppercase tracking-widest flex items-center gap-1">
                  <TrendingUp size={12} /> More
                </Link>
              </div>
              {trendingLoading
                ? Array.from({ length: 4 }).map((_, i) => <SkeletonBlock key={i} className="h-14 rounded mb-2" />)
                : trendingGames.slice(0, 6).map((game, i) => (
                    <Link key={game.id} href={`/library/${game.slug}`}>
                      <div className="flex items-center gap-3 p-2 rounded hover:bg-white/5 transition-colors cursor-pointer group mb-1">
                        <div className="w-10 h-10 rounded overflow-hidden shrink-0">
                          <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="font-rajdhani font-bold text-white text-sm truncate group-hover:text-red-300 transition-colors">{game.title}</div>
                          <div className="font-inter text-xs text-gray-500 flex items-center gap-1">
                            <Star size={10} className="text-yellow-500" fill="currentColor" /> {game.rating.toFixed(1)} · {game.genre}
                          </div>
                        </div>
                        <span className="font-orbitron text-xs text-gray-600 font-bold">#{i + 1}</span>
                      </div>
                    </Link>
                  ))}
            </section>

            {/* Library Stats */}
            <section className="glass-panel rounded-lg p-5">
              <h3 className="font-orbitron text-lg font-bold tracking-widest text-white mb-4 border-l-4 border-red-600 pl-3">LIBRARY STATUS</h3>
              {libraryLoading ? (
                <SkeletonBlock className="h-40 rounded" />
              ) : (
                <div className="space-y-3">
                  {[
                    { label: "Playing", color: "#22c55e", count: library.filter(e => e.status === "playing").length },
                    { label: "Completed", color: "#3b82f6", count: library.filter(e => e.status === "completed").length },
                    { label: "Wishlist", color: "#eab308", count: library.filter(e => e.status === "wishlist").length },
                    { label: "Not Started", color: "#6b7280", count: library.filter(e => e.status === "not_started").length },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="flex justify-between font-rajdhani text-sm mb-1">
                        <span className="text-gray-400">{s.label}</span>
                        <span className="text-white font-bold">{s.count}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: library.length > 0 ? `${(s.count / library.length) * 100}%` : "0%" }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: s.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* XP Progress */}
            <section className="glass-panel rounded-lg p-5">
              <h3 className="font-orbitron text-lg font-bold tracking-widest text-white mb-4 border-l-4 border-red-600 pl-3">XP PROGRESS</h3>
              {profileLoading ? (
                <SkeletonBlock className="h-20 rounded" />
              ) : (
                <div>
                  <div className="flex justify-between font-rajdhani text-sm mb-2">
                    <span className="text-red-400 font-bold">Level {profileData?.user?.level}</span>
                    <span className="text-gray-400">{profileData?.user?.xp?.toLocaleString()} XP</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(((profileData?.user?.xp ?? 0) % 1000) / 10, 100)}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full"
                      style={{ boxShadow: "0 0 10px rgba(239,68,68,0.5)" }}
                    />
                  </div>
                  <div className="flex justify-between font-rajdhani text-xs text-gray-500 mt-1">
                    <span>Level {profileData?.user?.level}</span>
                    <span>Level {(profileData?.user?.level ?? 1) + 1}</span>
                  </div>
                </div>
              )}
            </section>

            {dnaData?.dna && (
              <section className="glass-panel rounded-lg p-5 relative overflow-hidden border"
                style={{ borderColor: `${dnaData.dna.color}30` }}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] pointer-events-none opacity-20"
                  style={{ backgroundColor: dnaData.dna.color }} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-orbitron text-sm font-bold tracking-widest text-white border-l-4 border-red-600 pl-3">GAMER DNA</h3>
                    <Link href="/profile" className="font-rajdhani text-red-500 hover:text-red-400 text-xs uppercase tracking-widest">
                      Full Profile
                    </Link>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{dnaData.dna.icon}</span>
                    <div>
                      <p className="font-orbitron text-white text-sm font-bold tracking-wider"
                        style={{ textShadow: `0 0 12px ${dnaData.dna.color}50` }}>
                        {dnaData.dna.archetype}
                      </p>
                      <p className="font-rajdhani text-[10px] uppercase tracking-widest font-bold"
                        style={{ color: dnaData.dna.color }}>
                        {dnaData.dna.rarity} · Top Genre: {dnaData.dna.topGenre}
                      </p>
                    </div>
                  </div>
                  <p className="font-inter text-gray-500 text-xs line-clamp-2 leading-relaxed">{dnaData.dna.description}</p>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Trending Full Row */}
        {!trendingLoading && trendingGames.length > 0 && (
          <section>
            <div className="flex justify-between items-end mb-4">
              <h3 className="font-orbitron text-xl font-bold tracking-widest text-white border-l-4 border-red-600 pl-3">DISCOVER TRENDING</h3>
              <Link href="/discover" className="font-rajdhani text-red-500 hover:text-red-400 text-sm uppercase tracking-widest flex items-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {trendingGames.slice(0, 5).map((game, i) => (
                <Link key={game.id} href={`/library/${game.slug}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-[3/4] rounded-xl overflow-hidden border border-white/10 group-hover:border-red-500/50 group-hover:shadow-[0_0_20px_rgba(139,0,0,0.3)] transition-all duration-300">
                      <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <h4 className="font-rajdhani font-bold text-white mt-2 truncate text-sm group-hover:text-red-300 transition-colors">{game.title}</h4>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <Star size={10} className="text-yellow-500" fill="currentColor" />
                      <span>{game.rating.toFixed(1)}</span>
                      <span>·</span>
                      <span>{game.genre}</span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {(recsData?.recommendations ?? []).length > 0 && (
          <section>
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="font-orbitron text-xl font-bold tracking-widest text-white border-l-4 border-red-600 pl-3">RECOMMENDED FOR YOU</h3>
                <p className="font-rajdhani text-gray-500 text-xs uppercase tracking-widest mt-1 pl-7">Curated to your taste profile</p>
              </div>
              <Link href="/discover" className="font-rajdhani text-red-500 hover:text-red-400 text-sm uppercase tracking-widest flex items-center gap-1">
                Explore More <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {recsData!.recommendations.slice(0, 5).map((game, i) => (
                <Link key={game.id} href={`/library/${game.slug}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-[3/4] rounded-xl overflow-hidden border border-white/10 group-hover:border-red-500/50 group-hover:shadow-[0_0_20px_rgba(139,0,0,0.3)] transition-all duration-300">
                      <img src={game.coverImage} alt={game.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <h4 className="font-rajdhani font-bold text-white mt-2 truncate text-sm group-hover:text-red-300 transition-colors">{game.title}</h4>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <Star size={10} className="text-yellow-500" fill="currentColor" />
                      <span>{game.rating.toFixed(1)}</span>
                      <span>·</span>
                      <span>{game.genre}</span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {becauseData?.game && (becauseData.recommendations ?? []).length > 0 && (
          <section>
            <div className="flex items-end mb-4">
              <div>
                <h3 className="font-orbitron text-xl font-bold tracking-widest text-white border-l-4 border-red-600 pl-3">BECAUSE YOU PLAYED</h3>
                <p className="font-rajdhani text-red-400 text-xs uppercase tracking-widest mt-1 pl-7 truncate max-w-md">{becauseData.game.title}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {becauseData.recommendations.slice(0, 6).map((game, i) => (
                <Link key={game.id} href={`/library/${game.slug}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-[3/4] rounded-xl overflow-hidden border border-white/10 group-hover:border-red-500/50 group-hover:shadow-[0_0_20px_rgba(139,0,0,0.3)] transition-all duration-300">
                      <img src={game.coverImage} alt={game.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <h4 className="font-rajdhani font-bold text-white mt-2 truncate text-sm group-hover:text-red-300 transition-colors">{game.title}</h4>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <Star size={10} className="text-yellow-500" fill="currentColor" />
                      <span>{game.rating.toFixed(1)}</span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </AppLayout>
  );
}
