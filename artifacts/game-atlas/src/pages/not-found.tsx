import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Home, RotateCcw, Compass } from "lucide-react";

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; alpha: number; size: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.1,
        size: Math.random() * 2 + 0.5,
      });
    }

    let animId: number;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 0, 0, ${p.alpha})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    }
    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center relative overflow-hidden select-none">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(139,0,0,0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(139,0,0,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,0,0,0.08) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6"
        >
          <motion.p
            className="font-orbitron text-[10rem] font-black leading-none"
            style={{
              background: "linear-gradient(135deg, #8B0000 0%, #dc2626 40%, #8B0000 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 40px rgba(220,38,38,0.4))",
            }}
            animate={{
              filter: [
                "drop-shadow(0 0 20px rgba(220,38,38,0.3))",
                "drop-shadow(0 0 60px rgba(220,38,38,0.6))",
                "drop-shadow(0 0 20px rgba(220,38,38,0.3))",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            404
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-3"
        >
          <div className="h-px w-48 mx-auto mb-6"
            style={{ background: "linear-gradient(to right, transparent, #8B0000, transparent)" }}
          />
          <h1 className="font-orbitron text-2xl md:text-3xl font-black tracking-widest text-white uppercase mb-2">
            SECTOR NOT FOUND
          </h1>
          <p className="font-rajdhani text-gray-400 text-lg tracking-wide">
            The coordinates you entered don't exist in the GameAtlas database.
          </p>
          <div className="h-px w-48 mx-auto mt-6"
            style={{ background: "linear-gradient(to right, transparent, #8B0000, transparent)" }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 items-center"
        >
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-8 py-3 bg-red-700 hover:bg-red-600 text-white font-orbitron font-bold text-sm tracking-widest rounded-lg uppercase transition-colors shadow-[0_0_30px_rgba(139,0,0,0.4)]"
            >
              <Home size={16} />
              Return to Base
            </motion.button>
          </Link>

          <Link href="/discover">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-8 py-3 bg-transparent border border-red-800/60 hover:border-red-500 text-gray-300 hover:text-white font-orbitron font-bold text-sm tracking-widest rounded-lg uppercase transition-all"
            >
              <Compass size={16} />
              Discover Games
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-8 py-3 bg-transparent border border-white/10 hover:border-white/20 text-gray-500 hover:text-gray-300 font-orbitron font-bold text-sm tracking-widest rounded-lg uppercase transition-all"
          >
            <RotateCcw size={16} />
            Go Back
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 font-rajdhani text-gray-700 text-sm tracking-widest uppercase"
        >
          GAMEATLAS // ERROR_CODE: 0x404 // SECTOR_UNKNOWN
        </motion.p>
      </div>
    </div>
  );
}
