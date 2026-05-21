import { motion } from "framer-motion";

const stats = [
  { value: "40M+", label: "Active Players" },
  { value: "1.2B", label: "Hours Logged" },
  { value: "99.9%", label: "Uptime" },
  { value: "<15ms", label: "Cloud Latency" }
];

export function Stats() {
  return (
    <section className="py-24 relative z-10 border-y border-red-900/20 bg-background overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-red-900/30">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              className="text-center px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <h4 className="font-bebas text-5xl md:text-7xl text-white mb-2 neon-text-red">
                {stat.value}
              </h4>
              <p className="font-rajdhani uppercase tracking-widest text-sm text-gray-500 font-bold">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
