import { mockGames } from '@/lib/mockData';
import type { SearchResult } from '@/types';

export const searchService = {
  query: (q: string): SearchResult[] => {
    if (!q.trim()) return [];
    const lower = q.toLowerCase();
    return mockGames
      .filter(g => g.title.toLowerCase().includes(lower) || g.genre.toLowerCase().includes(lower))
      .slice(0, 8)
      .map(g => ({
        id: g.id,
        type: 'game' as const,
        title: g.title,
        subtitle: g.genre + ' • ' + g.platform,
        imageUrl: g.coverUrl,
        meta: g.rating.toString()
      }));
  },
  getTrending: (): string[] => ['Void Protocol', 'Crimson Covenant', 'Shadow Protocol', 'Neon Dynasty', 'Eclipse Rising'],
  getRecent: (): string[] => JSON.parse(localStorage.getItem('ga_recent_searches') || '[]'),
  saveRecent: (q: string) => {
    const recent: string[] = JSON.parse(localStorage.getItem('ga_recent_searches') || '[]');
    const updated = [q, ...recent.filter(r => r !== q)].slice(0, 5);
    localStorage.setItem('ga_recent_searches', JSON.stringify(updated));
  },
};
