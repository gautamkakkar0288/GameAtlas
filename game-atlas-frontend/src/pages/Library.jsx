import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Search, Play, Download, Trash2, Clock, CheckCircle2 } from "lucide-react";
// import { libraryService } from "../services/libraryService";

// --- MOCK DATA ---
const MOCK_LIBRARY = [
  {
    id: 1,
    game: {
      id: 1,
      title: "Elden Ring",
      coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    },
    installed: true,
    playtime: 1450, // minutes
    lastPlayed: "2026-05-01T14:30:00Z",
  },
  {
    id: 2,
    game: {
      id: 2,
      title: "God of War",
      coverImage: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80",
    },
    installed: false,
    playtime: 0,
    lastPlayed: null,
  },
  {
    id: 3,
    game: {
      id: 3,
      title: "Cyberpunk 2077",
      coverImage: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=800&q=80",
    },
    installed: true,
    playtime: 3200,
    lastPlayed: "2026-04-28T20:15:00Z",
  }
];

const Library = () => {
  const [library, setLibrary] = useState(MOCK_LIBRARY);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [busyGameId, setBusyGameId] = useState(null);

  // In a real scenario, you would fetch data here:
  /*
  useEffect(() => {
    const fetchLibrary = async () => {
      setLoading(true);
      try {
        const res = await libraryService.getLibrary();
        setLibrary(res.data);
      } catch (error) {
        toast.error("Failed to load library.");
      } finally {
        setLoading(false);
      }
    };
    fetchLibrary();
  }, []);
  */

  const handleInstall = async (gameId) => {
    setBusyGameId(gameId);
    // Simulate API call
    setTimeout(() => {
      setLibrary(library.map(item =>
        item.game.id === gameId ? { ...item, installed: true } : item
      ));
      toast.success("Game installed successfully!");
      setBusyGameId(null);
    }, 1500);
  };

  const handleUninstall = async (gameId) => {
    setBusyGameId(gameId);
    // Simulate API call
    setTimeout(() => {
      setLibrary(library.map(item =>
        item.game.id === gameId ? { ...item, installed: false } : item
      ));
      toast.success("Game uninstalled.");
      setBusyGameId(null);
    }, 1000);
  };

  const handlePlay = async (gameId, installed) => {
    if (!installed) {
      toast.error("You need to install the game first!");
      return;
    }
    setBusyGameId(gameId);
    toast.success("Launching game...");

    // Simulate playing for a bit then updating stats
    setTimeout(() => {
      setLibrary(library.map(item =>
        item.game.id === gameId
          ? { ...item, playtime: item.playtime + 60, lastPlayed: new Date().toISOString() }
          : item
      ));
      setBusyGameId(null);
    }, 2000);
  };

  const filteredLibrary = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return library;
    return library.filter((entry) => entry.game?.title?.toLowerCase().includes(keyword));
  }, [library, search]);

  const formatPlaytime = (minutes) => {
    if (!minutes) return "0 hrs";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} mins`;
    return `${hours} hrs ${mins} mins`;
  };

  const formatLastPlayed = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Calculate a mock "completion" percentage based on playtime (assuming 50 hours/3000 mins is 100%)
  const getProgress = (playtime) => {
    const safePlaytime = Number(playtime || 0);
    return Math.min(100, Math.round((safePlaytime / 3000) * 100));
  };

  return (
    <main className="min-h-screen bg-[#04050F] text-slate-100 selection:bg-purple-500/30 py-24">
      <div className="mx-auto max-w-[90rem] px-6 md:px-16 lg:px-24">

        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white mb-2 md:text-5xl">Your Library</h1>
            <p className="text-slate-400 font-medium">Manage your collection, track playtime, and launch games.</p>
          </div>

          <div className="relative min-w-[300px]">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your games..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-white outline-none focus:border-purple-500 focus:bg-white/10 transition-all font-medium placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex h-64 items-center justify-center rounded-3xl border border-white/10 bg-white/5">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500/30 border-t-purple-500" />
          </div>
        ) : filteredLibrary.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-white/20 bg-white/5 text-slate-400">
            <p className="mb-2 text-xl font-bold text-white">No games found.</p>
            <p>Try a different search term or add games from the store.</p>
            <Link to="/" className="mt-6 rounded-xl bg-purple-600 px-6 py-3 font-bold text-white transition hover:bg-purple-500">
              Browse Store
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredLibrary.map((entry, idx) => {
              const game = entry.game;
              const isBusy = busyGameId === game.id;
              const progress = getProgress(entry.playtime);

              return (
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={entry.id}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl transition-all hover:border-purple-500/30 hover:bg-white/10"
                >
                  {/* Image Header */}
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    <img
                      src={game.coverImage}
                      alt={game.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#04050F] to-transparent opacity-90" />

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-lg border">
                      {entry.installed ? (
                        <span className="flex items-center gap-1 text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                          <CheckCircle2 size={14} /> Installed
                        </span>
                      ) : (
                        <span className="text-slate-400 border-white/10 bg-black/50">
                          Not Installed
                        </span>
                      )}
                    </div>

                    <h3 className="absolute bottom-4 left-5 right-5 text-2xl font-black text-white truncate drop-shadow-lg">
                      {game.title}
                    </h3>
                  </div>

                  {/* Body Stats */}
                  <div className="flex flex-1 flex-col p-5">

                    <div className="mb-6 grid grid-cols-2 gap-4 rounded-2xl bg-black/30 p-4 border border-white/5">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Clock size={12} /> Playtime</p>
                        <p className="text-sm font-bold text-slate-200">{formatPlaytime(entry.playtime)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Last Played</p>
                        <p className="text-sm font-bold text-slate-200 truncate">{formatLastPlayed(entry.lastPlayed)}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-wider">
                        <span className="text-slate-500">Story Progress</span>
                        <span className="text-purple-400">{progress}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-black/50 border border-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-gradient-to-r from-purple-600 to-cyan-400"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-auto grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handlePlay(game.id, entry.installed)}
                        disabled={isBusy}
                        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-sm font-black text-white transition-all hover:scale-[1.03] disabled:opacity-50 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                      >
                        <Play size={16} fill="currentColor" /> Play
                      </button>

                      {entry.installed ? (
                        <button
                          onClick={() => handleUninstall(game.id)}
                          disabled={isBusy}
                          className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 py-3 text-sm font-bold text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                        >
                          <Trash2 size={16} /> Uninstall
                        </button>
                      ) : (
                        <button
                          onClick={() => handleInstall(game.id)}
                          disabled={isBusy}
                          className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10 disabled:opacity-50"
                        >
                          <Download size={16} /> Install
                        </button>
                      )}
                    </div>

                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default Library;