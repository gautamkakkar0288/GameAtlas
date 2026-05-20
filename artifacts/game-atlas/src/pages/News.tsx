import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageTransition } from '@/components/shared/PageTransition';
import { newsService } from '@/services/news.service';
import type { NewsCategory } from '@/types';
import { Clock, ExternalLink } from 'lucide-react';

export default function News() {
  const [category, setCategory] = useState<NewsCategory | 'All'>('All');
  
  const featured = newsService.getFeatured()[0];
  const articles = newsService.getByCategory(category).filter(a => a.id !== featured?.id);

  const categories: (NewsCategory | 'All')[] = ['All', 'Esports', 'AAA', 'Indie', 'PlayStation', 'Xbox', 'PC', 'Nintendo', 'Mobile'];

  const categoryColors: Record<string, string> = {
    Esports: '#9333ea', AAA: '#ef4444', Indie: '#22c55e', 
    PlayStation: '#3b82f6', Xbox: '#84cc16', PC: '#f97316', 
    Nintendo: '#ec4899', Mobile: '#06b6d4', All: '#ef4444'
  };

  return (
    <AppLayout>
      <PageTransition>
        <div className="space-y-10 pb-16">
          
          {/* Hero News Banner */}
          {featured && (
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden group border border-white/10 cursor-pointer">
              <div className="absolute inset-0 bg-black/50 z-10 transition-colors group-hover:bg-black/40" />
              <img src={featured.imageUrl} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              
              <div className="absolute inset-0 z-20 p-8 md:p-12 flex flex-col justify-end bg-gradient-to-t from-black via-black/60 to-transparent">
                <div className="max-w-3xl">
                  <span 
                    className="inline-block px-3 py-1 font-rajdhani font-bold text-white uppercase text-xs tracking-widest rounded mb-4 shadow-lg"
                    style={{ backgroundColor: categoryColors[featured.category] }}
                  >
                    {featured.category}
                  </span>
                  
                  <h1 className="font-bebas text-4xl md:text-6xl text-white tracking-wider mb-4 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                    {featured.title}
                  </h1>
                  
                  <p className="font-inter text-gray-300 mb-6 line-clamp-2 text-lg drop-shadow-md">
                    {featured.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-6">
                    <button className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-rajdhani uppercase font-bold tracking-widest rounded shadow-[0_0_20px_rgba(139,0,0,0.4)] transition-all flex items-center gap-2">
                      Read Article <ExternalLink size={16} />
                    </button>
                    <div className="flex items-center gap-4 font-inter text-gray-400 text-sm font-semibold">
                      <span>{featured.source}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-600" />
                      <span className="flex items-center gap-1"><Clock size={14} /> {featured.readTime} min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Category Tabs */}
          <div className="flex gap-6 border-b border-white/10 overflow-x-auto scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`pb-3 font-rajdhani font-bold uppercase tracking-widest text-sm relative transition-colors whitespace-nowrap ${
                  category === cat ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {cat}
                {category === cat && (
                  <motion.div 
                    layoutId="newsTab" 
                    className="absolute bottom-0 left-0 right-0 h-0.5" 
                    style={{ backgroundColor: categoryColors[cat], boxShadow: `0 0 10px ${categoryColors[cat]}` }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i % 3 * 0.1, duration: 0.4 }}
                className="group glass-panel rounded-xl overflow-hidden cursor-pointer hover:border-red-500/30 hover:shadow-[0_0_20px_rgba(139,0,0,0.15)] transition-all duration-300 flex flex-col h-full"
              >
                <div className="relative aspect-video overflow-hidden border-b border-white/10">
                  <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span 
                      className="px-2.5 py-1 font-rajdhani font-bold text-white uppercase text-[10px] tracking-widest rounded shadow-lg backdrop-blur-md bg-black/40 border border-white/10"
                      style={{ borderLeftColor: categoryColors[article.category], borderLeftWidth: '3px' }}
                    >
                      {article.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-rajdhani font-bold text-xl text-white mb-2 line-clamp-2 leading-tight group-hover:text-red-100 transition-colors">
                    {article.title}
                  </h3>
                  <p className="font-inter text-gray-400 text-sm line-clamp-2 mb-6">
                    {article.excerpt}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between font-inter text-xs text-gray-500">
                    <span className="font-semibold text-gray-300">{article.source}</span>
                    <div className="flex items-center gap-3">
                      <span>{new Date(article.publishedAt).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime}m</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
        </div>
      </PageTransition>
    </AppLayout>
  );
}
