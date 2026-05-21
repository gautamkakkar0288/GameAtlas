import { mockPosts, mockFriendsExtended, mockTrendingGames, type Post, type FriendExtended } from '@/lib/communityData';

export const communityService = {
  getPosts: (): Post[] => mockPosts,

  getPostsByType: (type: Post['type'] | 'all'): Post[] => {
    if (type === 'all') return mockPosts;
    return mockPosts.filter(p => p.type === type);
  },

  getFriends: (): FriendExtended[] => mockFriendsExtended,

  getOnlineFriends: (): FriendExtended[] =>
    mockFriendsExtended.filter(f => f.status !== 'offline'),

  getTrendingGames: () => mockTrendingGames,
};
