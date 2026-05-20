import { mockGames } from '@/lib/mockData';
import type { Platform, Genre } from '@/types';

export const gamesService = {
  getAll: () => mockGames,
  getFeatured: () => mockGames.slice(0, 5),
  getTrending: () => [...mockGames].sort((a, b) => b.playtime - a.playtime).slice(0, 8),
  getNewReleases: () => [...mockGames].sort((a, b) => b.releaseYear - a.releaseYear).slice(0, 8),
  getTopRated: () => [...mockGames].sort((a, b) => b.rating - a.rating).slice(0, 8),
  getMultiplayer: () => mockGames.filter(g => ['FPS', 'Action'].includes(g.genre)).slice(0, 8),
  getIndieGems: () => mockGames.filter(g => g.genre === 'Indie').slice(0, 6),
  getRecommended: () => mockGames.filter(g => g.status !== 'completed').slice(0, 8),
  getById: (id: string) => mockGames.find(g => g.id === id) ?? null,
  filter: (platform: Platform, genre: Genre) => mockGames.filter(g =>
    (platform === 'All' || g.platform === platform) &&
    (genre === 'All' || g.genre === genre)
  ),
};
