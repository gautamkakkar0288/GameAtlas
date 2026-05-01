import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const MotionDiv = motion.div;
const MotionArticle = motion.article;

const CLOUD_GAMES = [
  {
    id: 1,
    title: "Cyber Odyssey",
    genre: "Action RPG",
    quality: "4K Ultra",
    latency: "22ms",
    cover: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Neon Drift",
    genre: "Racing",
    quality: "1440p High",
    latency: "18ms",
    cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Realm Siege",
    genre: "Strategy",
    quality: "1080p High",
    latency: "26ms",
    cover: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Valor Front",
    genre: "Tactical Shooter",
    quality: "1440p Competitive",
    latency: "16ms",
    cover: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1400&auto=format&fit=crop",
  },
];

const CloudGaming = () => {
  const [activeGameId, setActiveGameId] = useState(CLOUD_GAMES[0].id);
  const [connectingGameId, setConnectingGameId] = useState(null);
  const [progress, setProgress] = useState(0);

  const activeGame = useMemo(
    () => CLOUD_GAMES.find((g) => g.id === activeGameId) || CLOUD_GAMES[0],
    [activeGameId]
  );

  const playNow = (gameId) => {
    setActiveGameId(gameId);
    setConnectingGameId(gameId);
    setProgress(0);

    let value = 0;
    const timer = setInterval(() => {
      value += Math.floor(Math.random() * 20) + 8;
      const next = Math.min(100, value);
      setProgress(next);
      if (next >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setConnectingGameId(null);
          toast.success("Connected to cloud server. Stream ready!");
        }, 500);
      }
    }, 350);
  };

  return (
    <main className="min-h-screen bg-[#04050F] text-slate-100">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute -left-20 top-8 h-72 w-72 rounded-full bg-cyan-500/15 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-72 w-72 rounded-full bg-purple-600/20 blur-[130px]" />
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 lg:px-20">
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Cloud Gaming</p>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">Play Instantly. No Downloads.</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Stream high-end titles with low-latency infrastructure. Demo mode enabled with simulated connection flow.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:px-12 lg:grid-cols-[1.6fr_1fr] lg:px-20">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/45">
          <div className="relative h-[420px]">
            <img src={activeGame.cover} alt={activeGame.title} className="h-full w-full object-cover opacity-75" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#04050F] via-[#04050F]/40 to-transparent" />
            <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs">
              {activeGame.quality}
            </div>

            <AnimatePresence>
              {connectingGameId === activeGame.id && (
                <MotionDiv
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#04050F]/78 backdrop-blur-sm"
                >
                  <MotionDiv
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                    className="mb-4 h-12 w-12 rounded-full border-2 border-cyan-300/40 border-t-cyan-300"
                  />
                  <p className="text-sm tracking-[0.14em] text-cyan-200 uppercase">Connecting to server...</p>
                  <div className="mt-4 h-2 w-72 overflow-hidden rounded-full bg-white/10">
                    <MotionDiv className="h-full bg-gradient-to-r from-cyan-400 to-purple-500" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-slate-300">{progress}%</p>
                </MotionDiv>
              )}
            </AnimatePresence>

            <div className="absolute left-6 bottom-6 z-10">
              <h2 className="text-3xl font-black">{activeGame.title}</h2>
              <p className="mt-1 text-slate-300">{activeGame.genre} • Avg Latency {activeGame.latency}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {CLOUD_GAMES.map((game) => (
            <MotionArticle
              key={game.id}
              whileHover={{ y: -4 }}
              className={`rounded-xl border p-4 transition ${
                activeGame.id === game.id
                  ? "border-purple-400/40 bg-purple-500/10"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold">{game.title}</h3>
                <span className="text-xs text-cyan-300">{game.latency}</span>
              </div>
              <p className="mb-4 text-sm text-slate-300">{game.genre} • {game.quality}</p>
              <button
                onClick={() => playNow(game.id)}
                disabled={connectingGameId !== null}
                className="btn btn-primary btn-sm"
              >
                Play Now
              </button>
            </MotionArticle>
          ))}
        </div>
      </section>
    </main>
  );
};

export default CloudGaming;

