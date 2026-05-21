import { motion } from "framer-motion";

const games = [
  { id: 1, title: "Neon Ronin", image: "/images/game1.png", tag: "Cyberpunk Action" },
  { id: 2, title: "Blood & Frost", image: "/images/game2.png", tag: "Dark Fantasy RPG" },
  { id: 3, title: "Void Protocol", image: "/images/game3.png", tag: "Sci-Fi Horror" },
  { id: 4, title: "Ash Walkers", image: "/images/game4.png", tag: "Vehicular Combat" },
  { id: 5, title: "Shadow of Babel", image: "/images/game5.png", tag: "Stealth Assassin" },
  { id: 6, title: "Titan Core", image: "/images/game6.png", tag: "Mecha Warfare" },
];

export function GameShowcase() {
  return (
    <section className="py-32 relative z-10 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="font-orbitron text-4xl md:text-6xl font-bold mb-4">
              The <span className="text-red-600">Vault</span>
            </h2>
            <p className="font-inter text-gray-400 max-w-xl text-lg">
              Your entire legacy across all platforms. Beautifully organized, instantly accessible.
            </p>
          </div>
          <button className="font-rajdhani uppercase tracking-widest text-sm text-red-500 hover:text-white transition-colors pb-2 border-b border-red-500/30 hover:border-white">
            View Full Library
          </button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, i) => (
            <motion.div
              key={game.id}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
            >
              <img 
                src={game.image} 
                alt={game.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
              <div className="absolute inset-0 border border-white/5 rounded-2xl group-hover:border-red-600/50 transition-colors duration-500 box-border"></div>
              
              <div className="absolute bottom-0 left-0 p-8 w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="font-rajdhani text-red-500 text-sm font-bold tracking-widest uppercase block mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {game.tag}
                </span>
                <h3 className="font-bebas text-4xl tracking-wide text-white drop-shadow-lg">
                  {game.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
