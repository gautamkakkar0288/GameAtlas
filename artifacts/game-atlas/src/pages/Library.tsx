import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, LayoutGrid, List, Star, Clock, AlertCircle, Heart, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { libraryApi, gamesApi, type LibraryEntry } from "@/lib/api";
import { auth } from "@/lib/auth";

function SkeletonCard() {
  return <div className="animate-pulse bg-white/5 rounded-lg aspect-[3/4]" />;
}

const StatusDot = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    playing: "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]",
    completed: "bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.8)]",
    wishlist: "bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.8)]",
    not_started: "bg-gray-500",
    paused: "bg-orange-500",
    dropped: "bg-red-800",
  };
  return <div className={`w-2 h-2 rounded-full ${map[status] ?? "bg-gray-500"}`} title={status} />;
};

const STATUS_OPTIONS = ["All", "playing", "completed", "wishlist", "not_started", "paused", "dropped"] as const;
const SORT_OPTIONS = ["Recently Added", "A-Z", "Playtime", "Rating"] as const;

export default function Library() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("Recently Added");
  const queryClient = useQueryClient();
  const user = auth.getUser();

  const { data, isLoading } = useQuery({
    queryKey: ["library"],
    queryFn: () => libraryApi.get(),
    staleTime: 30_000,
  });

  const { data: discoverData } = useQuery({
    queryKey: ["games-all"],
    queryFn: () => gamesApi.list({ limit: 20 }),
    staleTime: 60_000,
    enabled: !isLoading && (data?.library ?? []).length === 0,
  });

  const addMutation = useMutation({
    mutationFn: (gameId: number) => libraryApi.add({ gameId, status: "not_started" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["library"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ gameId, updates }: { gameId: number; updates: { status?: string; favorite?: boolean } }) =>
      libraryApi.update(gameId, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["library"] }),
  });

  const library = data?.library ?? [];

  const filteredEntries = useMemo(() => {
    let result = library.filter((e) => e.game !== null);

    if (search) {
      result = result.filter((e) => e.game!.title.toLowerCase().includes(search.toLowerCase()));
    }

    if (statusFilter !== "All") {
      result = result.filter((e) => e.status === statusFilter);
    }

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "A-Z": return (a.game?.title ?? "").localeCompare(b.game?.title ?? "");
        case "Playtime": return b.playtime - a.playtime;
        case "Rating": return (b.game?.rating ?? 0) - (a.game?.rating ?? 0);
        default: return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      }
    });

    return result;
  }, [library, search, statusFilter, sortBy]);

  const totalHours = filteredEntries.reduce((acc, e) => acc + e.playtime, 0);

  return (
    <AppLayout>
      <div className="space-y-6 pb-12 animate-in fade-in duration-500">
        {/* Header & Controls */}
        <div className="glass-panel p-4 md:p-6 rounded-xl space-y-6 sticky top-[76px] z-20 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="font-orbitron text-3xl font-black text-white tracking-widest border-l-4 border-red-600 pl-4">
              MY LIBRARY
            </h1>
            <div className="font-rajdhani text-sm text-gray-400 font-semibold tracking-wider uppercase flex gap-4">
              <span>Showing {filteredEntries.length} Games</span>
              <span className="text-red-500">•</span>
              <span>{totalHours.toFixed(1)} Hours Total</span>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex bg-black/50 p-1 rounded-lg border border-white/10 overflow-x-auto">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-4 py-2 rounded-md font-rajdhani font-bold uppercase tracking-wider text-sm transition-all whitespace-nowrap ${
                      statusFilter === s ? "bg-white/10 text-white" : "text-gray-500 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {s === "All" ? "All" : s.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 w-full xl:w-auto">
              <div className="relative flex-1 xl:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Find a game..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm font-inter text-white focus:outline-none focus:border-red-500/50 transition-all placeholder:text-gray-600"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-lg py-2 px-4 text-sm font-rajdhani font-bold uppercase tracking-wider text-white focus:outline-none focus:border-red-500/50 appearance-none cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              <div className="flex bg-black/50 p-1 rounded-lg border border-white/10 shrink-0">
                <button onClick={() => setView("grid")} className={`p-2 rounded-md transition-all ${view === "grid" ? "bg-white/10 text-white" : "text-gray-500 hover:text-white"}`}><LayoutGrid size={18} /></button>
                <button onClick={() => setView("list")} className={`p-2 rounded-md transition-all ${view === "list" ? "bg-white/10 text-white" : "text-gray-500 hover:text-white"}`}><List size={18} /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty library — show discoverable games */}
        {!isLoading && library.length === 0 && (
          <div className="space-y-6">
            <div className="glass-panel p-12 rounded-xl flex flex-col items-center justify-center text-center">
              <AlertCircle size={48} className="text-red-500 mb-4 opacity-50" />
              <h3 className="font-orbitron text-2xl font-bold text-white mb-2">LIBRARY EMPTY</h3>
              <p className="font-inter text-gray-500 mb-6">Add games from the Discover page to start tracking your journey.</p>
              <Link href="/discover" className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-rajdhani uppercase font-bold tracking-widest rounded transition-colors">
                Discover Games
              </Link>
            </div>
            {discoverData && discoverData.games.length > 0 && (
              <div>
                <h3 className="font-orbitron text-xl font-bold text-white mb-4 border-l-4 border-red-600 pl-3">SUGGESTED GAMES</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {discoverData.games.slice(0, 10).map((game) => (
                    <motion.div key={game.id} whileHover={{ y: -4 }} className="group cursor-pointer">
                      <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-white/10 hover:border-red-500/50 transition-all">
                        <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        <button
                          onClick={() => addMutation.mutate(game.id)}
                          disabled={addMutation.isPending}
                          className="absolute bottom-3 left-3 right-3 py-1.5 bg-red-600/90 hover:bg-red-500 text-white font-rajdhani uppercase text-xs font-bold rounded flex items-center justify-center gap-1 transition-colors"
                        >
                          <Plus size={12} /> Add to Library
                        </button>
                      </div>
                      <p className="font-rajdhani font-bold text-white mt-2 truncate text-sm">{game.title}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* No results for filter */}
        {!isLoading && library.length > 0 && filteredEntries.length === 0 && (
          <div className="glass-panel p-12 rounded-xl flex flex-col items-center justify-center text-center">
            <AlertCircle size={48} className="text-red-500 mb-4 opacity-50" />
            <h3 className="font-orbitron text-2xl font-bold text-white mb-2">NO GAMES FOUND</h3>
            <p className="font-inter text-gray-500">Adjust your filters or search query.</p>
          </div>
        )}

        {/* Grid view */}
        {!isLoading && filteredEntries.length > 0 && view === "grid" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <AnimatePresence>
              {filteredEntries.map((entry) => (
                <motion.div
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href={`/library/${entry.game!.slug}`}>
                    <div className="group relative aspect-[3/4] rounded-lg overflow-hidden border border-white/10 hover:border-red-500 transition-all duration-300 cursor-pointer hover:shadow-[0_0_30px_rgba(139,0,0,0.4)] hover:-translate-y-2 bg-[#0d0d0d]">
                      <img
                        src={entry.game!.coverImage}
                        alt={entry.game!.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-40"
                      />
                      {entry.favorite && (
                        <div className="absolute top-3 left-3 z-10">
                          <Heart size={14} fill="#ef4444" className="text-red-500" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                      <div className="absolute inset-0 z-20 p-4 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
                        <div className="font-rajdhani font-bold text-white text-lg mb-4 text-center px-2">{entry.game!.title}</div>
                        <div className="space-y-2 w-full px-4">
                          <div className="flex justify-between items-center text-xs font-inter text-gray-300">
                            <span className="flex items-center gap-1"><Clock size={12} className="text-red-400" /> {entry.playtime.toFixed(0)}h</span>
                            <span className="flex items-center gap-1"><Star size={12} className="text-yellow-400" /> {entry.game!.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.preventDefault(); updateMutation.mutate({ gameId: entry.game!.id, updates: { favorite: !entry.favorite } }); }}
                          className="mt-3 px-4 py-1.5 bg-white/10 hover:bg-red-900/40 border border-white/20 hover:border-red-500/40 text-white font-rajdhani uppercase text-xs font-bold rounded transition-all flex items-center gap-1"
                        >
                          <Heart size={11} fill={entry.favorite ? "currentColor" : "none"} className={entry.favorite ? "text-red-400" : ""} />
                          {entry.favorite ? "Unfavorite" : "Favorite"}
                        </button>
                        <button className="mt-2 px-6 py-2 bg-red-600 text-white font-rajdhani uppercase text-sm font-bold tracking-widest rounded shadow-[0_0_15px_rgba(139,0,0,0.5)] border border-red-400">
                          DETAILS
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 z-20 group-hover:opacity-0 transition-opacity duration-300">
                        <div className="flex items-center gap-2 mb-1">
                          <StatusDot status={entry.status} />
                          <span className="font-rajdhani text-[10px] uppercase tracking-wider text-gray-400 font-bold">{entry.game!.genre}</span>
                        </div>
                        <h3 className="font-orbitron text-sm font-bold text-white truncate">{entry.game!.title}</h3>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* List view */}
        {!isLoading && filteredEntries.length > 0 && view === "list" && (
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 font-rajdhani text-gray-400 uppercase tracking-wider text-sm bg-white/5">
                    <th className="p-4 font-bold">Game</th>
                    <th className="p-4 font-bold">Platform</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold">Playtime</th>
                    <th className="p-4 font-bold">Rating</th>
                    <th className="p-4 font-bold"></th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredEntries.map((entry) => (
                      <motion.tr
                        key={entry.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                        onClick={() => { window.location.href = `/library/${entry.game!.slug}`; }}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <img src={entry.game!.coverImage} alt={entry.game!.title} className="w-10 h-14 object-cover rounded opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div>
                              <div className="font-orbitron font-bold text-white group-hover:text-red-100 transition-colors">{entry.game!.title}</div>
                              <div className="font-rajdhani text-xs text-gray-500 uppercase tracking-wider">{entry.game!.genre}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-inter text-sm text-gray-300">{entry.game!.platform}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <StatusDot status={entry.status} />
                            <span className="font-inter text-sm text-gray-300 capitalize">{entry.status.replace("_", " ")}</span>
                          </div>
                        </td>
                        <td className="p-4 font-inter text-sm text-gray-300">{entry.playtime.toFixed(0)} hrs</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-yellow-400">
                            <Star size={14} fill="currentColor" />
                            <span className="font-inter text-sm text-white">{entry.game!.rating.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={(e) => { e.stopPropagation(); updateMutation.mutate({ gameId: entry.game!.id, updates: { favorite: !entry.favorite } }); }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Heart size={16} fill={entry.favorite ? "#ef4444" : "none"} className={entry.favorite ? "text-red-500" : "text-gray-500 hover:text-red-400"} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
