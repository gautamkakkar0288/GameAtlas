import { motion } from "framer-motion";
import { Cpu, Cloud, Users, Trophy, Target, Activity, Search, Rss } from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "AI Game Recommendations",
    description: "Neural net analysis of your playstyle to predict your next 1000-hour obsession."
  },
  {
    icon: Cloud,
    title: "Cross-Platform Sync",
    description: "Steam, Epic, Riot. One unified library. Your saves and achievements, everywhere."
  },
  {
    icon: Users,
    title: "Community Hub",
    description: "Form squads, share clips, and build guilds in a hyper-connected social layer."
  },
  {
    icon: Trophy,
    title: "Esports & Tournaments",
    description: "Integrated bracket systems, live prize pools, and instant competitive matchmaking."
  },
  {
    icon: Target,
    title: "Achievement Tracking",
    description: "A universal prestige system. Show off your rarest unlocked trophies across all launchers."
  },
  {
    icon: Activity,
    title: "Live Statistics",
    description: "Granular telemetry on your performance, from K/D ratios to APM in real-time."
  },
  {
    icon: Search,
    title: "Game Discovery Engine",
    description: "Semantic search through millions of titles. Find hidden gems before they explode."
  },
  {
    icon: Rss,
    title: "Gaming News Feed",
    description: "Aggregated patch notes, developer diaries, and breaking news tailored to your library."
  }
];

export function Features() {
  return (
    <section className="py-32 relative z-10 bg-background">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="font-orbitron text-4xl md:text-6xl font-bold mb-6 tracking-wide">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-white">Forged</span> For The Elite
          </h2>
          <p className="font-inter text-gray-400 max-w-2xl mx-auto text-lg">
            Every tool you need to dominate. Built with uncompromising performance and dark aesthetic precision.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="glass-panel p-8 rounded-xl group hover:glass-panel-red transition-all duration-500 relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-colors"></div>
              
              <feature.icon className="w-10 h-10 text-red-600 mb-6 group-hover:scale-110 transition-transform duration-300" />
              
              <h3 className="font-rajdhani text-xl font-bold text-white mb-3 tracking-wide">
                {feature.title}
              </h3>
              
              <p className="font-inter text-sm text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
