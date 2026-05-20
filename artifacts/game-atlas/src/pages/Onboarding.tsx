import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { onboardingApi } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { Check, ChevronRight, Sparkles, ArrowLeft } from "lucide-react";

const GENRES = [
  { id: "RPG", icon: "🗡️" },
  { id: "Action", icon: "⚡" },
  { id: "Strategy", icon: "♟️" },
  { id: "FPS", icon: "🎯" },
  { id: "Adventure", icon: "🗺️" },
  { id: "Indie", icon: "💎" },
  { id: "Sports", icon: "⚽" },
  { id: "Racing", icon: "🏎️" },
  { id: "Puzzle", icon: "🧩" },
];

const PLAYSTYLES = [
  { id: "casual", label: "Casual Explorer", description: "I play to relax and have fun", icon: "🎮" },
  { id: "competitive", label: "Competitive Grinder", description: "I push for the top spot", icon: "⚔️" },
  { id: "completionist", label: "Completionist", description: "100% everything or nothing", icon: "✅" },
  { id: "story", label: "Story Hunter", description: "I live for great narratives", icon: "📖" },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [genres, setGenres] = useState<string[]>([]);
  const [playStyle, setPlayStyle] = useState("");
  const [saving, setSaving] = useState(false);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const toggleGenre = (g: string) => {
    setGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : prev.length < 4 ? [...prev, g] : prev
    );
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      await onboardingApi.save({ favoriteGenres: genres, playStyle });
      await queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      await queryClient.invalidateQueries({ queryKey: ["gamer-dna"] });
    } catch {
      // Continue anyway
    } finally {
      setSaving(false);
      setStep(3);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: i % 3 === 0 ? "#ef4444" : i % 3 === 1 ? "#8b5cf6" : "#f59e0b",
              opacity: 0.3,
            }}
            animate={{ opacity: [0, 0.6, 0], scale: [0, 1.5, 0] }}
            transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 6 }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,0,0,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="font-orbitron text-red-500 font-black text-sm tracking-widest">GAME</span>
              <span className="font-orbitron text-white font-black text-sm tracking-widest">ATLAS</span>
            </div>
            <span className="font-rajdhani text-gray-500 text-sm uppercase tracking-wider">
              {step < 3 ? `Step ${step} of 2` : "Complete"}
            </span>
          </div>
          <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-red-800 to-red-400 rounded-full"
              animate={{ width: step === 1 ? "50%" : "100%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4 }}
              className="bg-[rgba(13,13,13,0.85)] backdrop-blur-xl rounded-2xl p-8 border border-red-900/30 shadow-[0_0_60px_rgba(0,0,0,0.5)]"
            >
              <h1 className="font-orbitron text-3xl md:text-4xl font-black text-white mb-2 tracking-widest leading-tight">
                WHAT DO YOU{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">
                  PLAY?
                </span>
              </h1>
              <p className="font-rajdhani text-gray-400 uppercase tracking-widest text-sm mb-8">
                Select up to 4 favorite genres to calibrate your DNA
              </p>

              <div className="grid grid-cols-3 gap-3 mb-8">
                {GENRES.map((g) => {
                  const selected = genres.includes(g.id);
                  const disabled = !selected && genres.length >= 4;
                  return (
                    <button
                      key={g.id}
                      onClick={() => toggleGenre(g.id)}
                      disabled={disabled}
                      className={`py-4 rounded-xl font-rajdhani font-bold uppercase tracking-wider text-sm transition-all border flex flex-col items-center gap-2 ${
                        selected
                          ? "bg-red-600/20 border-red-500 text-white shadow-[0_0_20px_rgba(139,0,0,0.3)]"
                          : disabled
                          ? "bg-white/3 border-white/5 text-gray-600 cursor-not-allowed"
                          : "bg-white/5 border-white/10 text-gray-400 hover:border-red-500/50 hover:text-white hover:bg-white/8"
                      }`}
                    >
                      <span className="text-xl">{g.icon}</span>
                      <span className="flex items-center gap-1">
                        {selected && <Check size={11} />}
                        {g.id}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between">
                <span className="font-rajdhani text-gray-600 text-sm">
                  {genres.length}/4 selected
                </span>
                <button
                  onClick={() => setStep(2)}
                  disabled={genres.length === 0}
                  className="px-8 py-3 bg-gradient-to-r from-red-900 to-red-600 hover:from-red-800 hover:to-red-500 text-white font-orbitron font-bold tracking-widest rounded-lg disabled:opacity-40 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(139,0,0,0.3)]"
                >
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4 }}
              className="bg-[rgba(13,13,13,0.85)] backdrop-blur-xl rounded-2xl p-8 border border-red-900/30 shadow-[0_0_60px_rgba(0,0,0,0.5)]"
            >
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-gray-500 hover:text-white font-rajdhani text-sm uppercase tracking-wider mb-6 transition-colors"
              >
                <ArrowLeft size={14} /> Back
              </button>

              <h1 className="font-orbitron text-3xl md:text-4xl font-black text-white mb-2 tracking-widest leading-tight">
                HOW DO YOU{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">
                  PLAY?
                </span>
              </h1>
              <p className="font-rajdhani text-gray-400 uppercase tracking-widest text-sm mb-8">
                Choose your gaming identity
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {PLAYSTYLES.map((ps) => (
                  <button
                    key={ps.id}
                    onClick={() => setPlayStyle(ps.id)}
                    className={`p-5 rounded-xl text-left border transition-all ${
                      playStyle === ps.id
                        ? "bg-red-600/20 border-red-500 shadow-[0_0_20px_rgba(139,0,0,0.3)]"
                        : "bg-white/5 border-white/10 hover:border-red-500/50 hover:bg-white/8"
                    }`}
                  >
                    <div className="text-3xl mb-3">{ps.icon}</div>
                    <div className="font-orbitron font-bold text-white text-sm tracking-wider mb-1">
                      {ps.label}
                    </div>
                    <div className="font-inter text-gray-400 text-xs leading-relaxed">
                      {ps.description}
                    </div>
                    {playStyle === ps.id && (
                      <div className="mt-3 flex items-center gap-1 text-red-400">
                        <Check size={12} />
                        <span className="font-rajdhani text-xs uppercase tracking-wider">Selected</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={handleComplete}
                disabled={!playStyle || saving}
                className="w-full py-4 bg-gradient-to-r from-red-900 to-red-600 hover:from-red-800 hover:to-red-500 text-white font-orbitron font-bold tracking-widest rounded-lg disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,0,0,0.3)]"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Calibrating DNA...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Reveal My DNA
                  </>
                )}
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-[rgba(13,13,13,0.85)] backdrop-blur-xl rounded-2xl p-8 border border-red-900/30 shadow-[0_0_60px_rgba(0,0,0,0.5)] text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="text-7xl mb-6 inline-block"
              >
                🎮
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h1 className="font-orbitron text-4xl font-black text-white mb-3 tracking-widest">
                  YOU&apos;RE{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">
                    CALIBRATED
                  </span>
                </h1>
                <p className="font-rajdhani text-gray-400 uppercase tracking-widest text-sm mb-6">
                  GameAtlas is personalizing your entire experience
                </p>

                <div className="flex flex-wrap gap-2 justify-center mb-8">
                  {genres.map((g) => (
                    <span
                      key={g}
                      className="px-3 py-1.5 bg-red-950/40 border border-red-900/50 rounded-lg font-rajdhani text-red-300 text-xs uppercase tracking-wider"
                    >
                      {g}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setLocation("/dashboard")}
                  className="w-full py-4 bg-gradient-to-r from-red-900 to-red-600 hover:from-red-800 hover:to-red-500 text-white font-orbitron font-bold tracking-widest rounded-lg transition-all shadow-[0_0_30px_rgba(139,0,0,0.4)]"
                >
                  Enter The Nexus →
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
