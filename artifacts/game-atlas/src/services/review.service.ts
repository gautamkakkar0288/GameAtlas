import { mockReviews, type Review } from '@/lib/communityData';

export const reviewService = {
  getAll: (): Review[] => mockReviews,

  getFeatured: (): Review | undefined => mockReviews.find(r => r.featured),

  getByGame: (gameId: string): Review[] => mockReviews.filter(r => r.gameId === gameId),

  sortBy: (reviews: Review[], sort: 'helpful' | 'newest' | 'rating' | 'controversial'): Review[] => {
    const sorted = [...reviews];
    switch (sort) {
      case 'helpful': return sorted.sort((a, b) => b.helpful - a.helpful);
      case 'newest': return sorted;
      case 'rating': return sorted.sort((a, b) => b.rating - a.rating);
      case 'controversial': return sorted.sort((a, b) => b.dislikes - a.dislikes);
      default: return sorted;
    }
  },

  getRatingDistribution: (reviews: Review[]): { star: number; count: number; percent: number }[] => {
    const total = reviews.length || 1;
    return [5, 4, 3, 2, 1].map(star => {
      const count = reviews.filter(r => Math.floor(r.rating) === star).length;
      return { star, count, percent: (count / total) * 100 };
    });
  },
};
