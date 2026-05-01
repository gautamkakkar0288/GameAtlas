import React, { useContext, useState } from "react";
import { AuthContext } from "../context/auth-context";
import { UserCircle, Mail, Key, LogOut, Trophy, Clock, Gamepad2, Medal } from "lucide-react";
import { motion } from "framer-motion";

const MOCK_ACHIEVEMENTS = [
  { id: 1, title: "First Blood", desc: "Defeat your first boss.", icon: "🗡️", game: "Elden Ring", unlocked: true },
  { id: 2, title: "Speed Demon", desc: "Complete a lap under 1 minute.", icon: "🏎️", game: "Neon Drift", unlocked: true },
  { id: 3, title: "Completionist", desc: "Unlock all other achievements.", icon: "🏆", game: "Cyberpunk 2077", unlocked: false },
  { id: 4, title: "Sharpshooter", desc: "Get 50 headshots.", icon: "🎯", game: "Valorant", unlocked: true },
];

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("overview");

  if (!user) return <div className="flex min-h-screen items-center justify-center bg-[#04050F] text-white">Loading profile...</div>;

  const defaultPic = "https://ui-avatars.com/api/?name=" + user.name + "&background=6d28d9&color=fff&size=256";
  const getPicUrl = () => {
    if (!user.profilePic) return defaultPic;
    if (user.profilePic.startsWith("http")) return user.profilePic;
    return `${import.meta.env.VITE_API_URL?.replace('/api', '')}/${user.profilePic.replace(/\\/g, '/')}`;
  };

  return (
    <main className="min-h-screen bg-[#04050F] text-slate-100 selection:bg-purple-500/30">

      {/* 🎬 HEADER BANNER */}
      <section className="relative h-64 w-full overflow-hidden border-b border-white/10 bg-gradient-to-r from-purple-900/40 to-cyan-900/20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=1920&q=80')] opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04050F] to-transparent" />
      </section>

      {/* 👤 PROFILE CONTENT */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24 md:px-16 lg:px-24">

        {/* Avatar & Basic Info */}
        <div className="relative -mt-20 mb-12 flex flex-col items-center gap-6 md:flex-row md:items-end">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-[#04050F] shadow-[0_0_30px_rgba(109,40,217,0.5)]"
          >
            <img src={getPicUrl()} alt="Profile" className="h-full w-full object-cover" />
          </motion.div>

          <div className="text-center md:mb-4 md:text-left">
            <h1 className="text-4xl font-black text-white md:text-5xl">{user.name}</h1>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <span className="flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm font-bold text-purple-400">
                <Medal size={16} /> Level 42 Master
              </span>
              <span className="text-sm font-medium text-slate-500">Member since 2026</span>
            </div>
          </div>

          <div className="md:ml-auto md:mb-4">
            <button onClick={logout} className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-3 font-bold text-red-400 transition-colors hover:bg-red-500/20">
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>

        {/* 📑 TABS */}
        <div className="mb-8 flex gap-8 border-b border-white/10 text-sm font-bold uppercase tracking-widest text-slate-500 overflow-x-auto scrollbar-hide">
          <button onClick={() => setActiveTab("overview")} className={`pb-4 transition-colors whitespace-nowrap ${activeTab === "overview" ? "border-b-2 border-cyan-400 text-cyan-400" : "hover:text-white"}`}>Overview</button>
          <button onClick={() => setActiveTab("achievements")} className={`pb-4 transition-colors whitespace-nowrap ${activeTab === "achievements" ? "border-b-2 border-cyan-400 text-cyan-400" : "hover:text-white"}`}>Achievements</button>
          <button onClick={() => setActiveTab("settings")} className={`pb-4 transition-colors whitespace-nowrap ${activeTab === "settings" ? "border-b-2 border-cyan-400 text-cyan-400" : "hover:text-white"}`}>Account Info</button>
        </div>

        {/* 🗂️ TAB CONTENT */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Main Content Area */}
          <div className="lg:col-span-2">

            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-md">
                    <Gamepad2 className="mx-auto mb-2 text-cyan-400" size={28} />
                    <p className="text-3xl font-black text-white">24</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Games Owned</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-md">
                    <Clock className="mx-auto mb-2 text-purple-400" size={28} />
                    <p className="text-3xl font-black text-white">840h</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Playtime</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-md">
                    <Trophy className="mx-auto mb-2 text-amber-400" size={28} />
                    <p className="text-3xl font-black text-white">156</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Achievements</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-md">
                    <UserCircle className="mx-auto mb-2 text-pink-400" size={28} />
                    <p className="text-3xl font-black text-white">12</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Friends</p>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
                  <h3 className="mb-6 text-xl font-black text-white">Recent Activity</h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 overflow-hidden rounded-xl bg-black">
                        <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=80" alt="Game" className="h-full w-full object-cover opacity-80" />
                      </div>
                      <div>
                        <p className="font-bold text-white">Played Elden Ring</p>
                        <p className="text-sm text-slate-400">For 3 hours • Yesterday</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/30">
                        <span className="text-2xl">🏆</span>
                      </div>
                      <div>
                        <p className="font-bold text-white">Unlocked "Speed Demon"</p>
                        <p className="text-sm text-slate-400">Neon Drift • 3 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ACHIEVEMENTS TAB */}
            {activeTab === "achievements" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {MOCK_ACHIEVEMENTS.map(ach => (
                  <div key={ach.id} className={`flex items-start gap-4 rounded-2xl border p-5 transition-colors ${ach.unlocked ? 'border-white/10 bg-white/5' : 'border-white/5 bg-black/40 opacity-60'}`}>
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl ${ach.unlocked ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-white/5 border border-white/10 grayscale'}`}>
                      {ach.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{ach.title}</h4>
                      <p className="text-xs font-bold text-purple-400 mb-1">{ach.game}</p>
                      <p className="text-sm text-slate-400 leading-snug">{ach.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* SETTINGS/INFO TAB */}
            {activeTab === "settings" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="flex items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                  <div className="rounded-full bg-cyan-500/20 p-4 text-cyan-400"><UserCircle size={24} /></div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Display Name</p>
                    <p className="text-xl font-bold text-white">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                  <div className="rounded-full bg-purple-500/20 p-4 text-purple-400"><Mail size={24} /></div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</p>
                    <p className="text-xl font-bold text-white">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                  <div className="rounded-full bg-emerald-500/20 p-4 text-emerald-400"><Key size={24} /></div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Account Type</p>
                    <p className="text-xl font-bold text-white">{user.googleId ? "Google Linked Account" : "Standard Account"}</p>
                  </div>
                </div>
              </motion.div>
            )}

          </div>

          {/* Right Column: Mini Social Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <h3 className="mb-4 text-lg font-black text-white border-b border-white/10 pb-4">Online Friends (3)</h3>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-800">
                        <img src={`https://ui-avatars.com/api/?name=Player${i}&background=random`} alt="friend" />
                      </div>
                      <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#10122B] bg-emerald-500"></div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Player {i}</p>
                      <p className="text-xs text-purple-400 truncate">Playing Elden Ring</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full rounded-xl bg-white/10 py-3 text-sm font-bold text-white transition hover:bg-white/20">View All Friends</button>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
};

export default Profile;