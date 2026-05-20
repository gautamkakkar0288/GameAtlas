import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          timeoutId = setTimeout(onComplete, 500);
          return 100;
        }
        return Math.min(p + Math.floor(Math.random() * 15) + 5, 100);
      });
    }, 150);

    return () => {
      clearInterval(timer);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
    >
      <div className="relative">
        <motion.h1 
          className="font-orbitron text-5xl md:text-7xl font-black tracking-widest text-white mb-8"
          animate={{
            textShadow: [
              "0 0 0px rgba(255,0,0,0)",
              "0 0 20px rgba(255,0,0,0.8)",
              "0 0 0px rgba(255,0,0,0)"
            ],
            x: [0, -2, 2, -1, 0],
          }}
          transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 1.5 }}
        >
          GAME<span className="text-red-600">ATLAS</span>
        </motion.h1>
        
        <div className="w-64 h-1 bg-gray-900 rounded-full overflow-hidden relative">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-red-600"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-4 font-rajdhani text-red-500 font-bold tracking-widest text-center text-sm">
          INITIALIZING SYSTEM... {Math.min(progress, 100)}%
        </div>
      </div>
    </motion.div>
  );
}
