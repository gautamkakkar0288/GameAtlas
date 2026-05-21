import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command } from "lucide-react";

const placeholders = [
  "Search 'Cyberpunk 2077'",
  "Find your next obsession...",
  "Search cross-platform library",
  "Looking for 'Elden Ring'?",
];

export function SearchBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full py-20 px-4 relative z-20">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          className="relative glass-panel rounded-2xl p-2 flex items-center group hover:glass-panel-red transition-all duration-500"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="p-4 text-gray-400 group-hover:text-red-500 transition-colors">
            <Search size={24} />
          </div>
          
          <div className="flex-1 relative h-8 overflow-hidden flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center font-rajdhani text-lg text-gray-300 pointer-events-none"
              >
                {placeholders[index]}
              </motion.div>
            </AnimatePresence>
            <input 
              type="text"
              className="w-full h-full bg-transparent outline-none text-white font-rajdhani text-lg"
            />
          </div>

          <div className="hidden sm:flex items-center gap-1 px-4 text-gray-500 font-mono text-sm">
            <Command size={14} />
            <span>K</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
