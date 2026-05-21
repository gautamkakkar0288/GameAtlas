import type { NewsArticle, NewsCategory } from '@/types';

const categories: NewsCategory[] = ['Esports', 'AAA', 'Indie', 'PlayStation', 'Xbox', 'PC', 'Nintendo', 'Mobile'];
const titles = [
  "Sony Reveals PlayStation 6 Specs",
  "Void Protocol Expansion Drops Next Month",
  "World Esports Championship Finals Set for Tokyo",
  "Indie Darling 'Echoes' Reaches 1M Sales",
  "New Xbox Game Pass Titles Announced",
  "Massive Update for Apex Legends Released",
  "Nintendo Direct: Everything Announced",
  "Mobile Gaming Revenue Hits New High",
  "Cybernetic Drift Gets Multiplayer Mode",
  "The Last Bastion: Developer Interview",
  "Crimson Covenant Balance Patch Notes",
  "Shadow Protocol's New Hero Revealed",
  "Eclipse Rising Developer Teases Sequel",
  "Phantom Gate: Speedrunning Guide",
  "Stellar Horizon Beginners Tips",
  "Bloodline Requiem: Hidden Secrets Discovered"
];

const mockArticles: NewsArticle[] = Array.from({ length: 16 }, (_, i) => ({
  id: `n${i + 1}`,
  title: titles[i % titles.length],
  excerpt: "The latest news and updates from the gaming world, bringing you everything you need to know about upcoming releases, events, and patches.",
  imageUrl: `https://picsum.photos/seed/news${i + 1}/800/450`,
  source: i % 2 === 0 ? "IGN" : "Polygon",
  readTime: Math.floor(Math.random() * 8) + 2,
  category: categories[i % categories.length],
  publishedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  featured: i < 3
}));

export const newsService = {
  getAll: () => mockArticles,
  getFeatured: () => mockArticles.filter(a => a.featured),
  getByCategory: (category: NewsCategory | 'All') => category === 'All' ? mockArticles : mockArticles.filter(a => a.category === category)
};
