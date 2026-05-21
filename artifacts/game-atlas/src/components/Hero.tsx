import { motion } from "framer-motion";
import { ChevronRight, Play } from "lucide-react";
import { Link } from "wouter";

export function Hero() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      {/* Background with noise and dark gradient */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(20,0,0,0.8)_0%,rgba(5,5,5,1)_100%)]"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h2 className="font-rajdhani text-red-500 tracking-[0.3em] uppercase text-sm md:text-lg mb-4 font-bold">
            The Nexus of Gaming
          </h2>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.4, type: "spring", stiffness: 50 }}
        >
          <h1 className="font-orbitron text-6xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-800 drop-shadow-2xl mb-6">
            GAMEATLAS
          </h1>
        </motion.div>

        <motion.p 
          className="font-inter text-gray-400 max-w-2xl text-lg md:text-xl mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          One unified universe. Every game you've ever loved.
          Step into a hyperrealistic future where gaming is a civilization.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <Link href="/library" className="group relative px-8 py-4 bg-primary text-white font-rajdhani uppercase tracking-widest font-bold overflow-hidden">
            <div className="absolute inset-0 bg-red-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <span className="relative z-10 flex items-center gap-2">
              <Play size={18} fill="currentColor" /> Explore Games
            </span>
          </Link>
          
          <Link href="/signup" className="group relative px-8 py-4 glass-panel text-white font-rajdhani uppercase tracking-widest font-bold hover:glass-panel-red transition-all duration-300">
            <span className="relative z-10 flex items-center gap-2">
              Join Community <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <span className="font-rajdhani text-xs tracking-widest uppercase">Scroll to Descend</span>
        <motion.div 
          className="w-[1px] h-12 bg-gradient-to-b from-red-600 to-transparent"
          animate={{ height: [0, 48, 0], y: [0, 24, 48] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
