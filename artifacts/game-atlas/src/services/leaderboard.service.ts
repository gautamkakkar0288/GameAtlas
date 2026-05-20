import { mockLeaderboard, type LeaderboardEntry } from '@/lib/communityData';

export const leaderboardService = {
  getGlobal: (): LeaderboardEntry[] => mockLeaderboard,

  getTop3: (): LeaderboardEntry[] => mockLeaderboard.slice(0, 3),

  getFriends: (): LeaderboardEntry[] => mockLeaderboard.filter(e => e.isFriend || e.isCurrentUser),

  filterBy: (options: {
    platform?: string;
    region?: string;
    friendsOnly?: boolean;
  }): LeaderboardEntry[] => {
    let entries = mockLeaderboard;
    if (options.friendsOnly) entries = entries.filter(e => e.isFriend || e.isCurrentUser);
    if (options.platform && options.platform !== 'All') entries = entries.filter(e => e.platform === options.platform);
    if (options.region && options.region !== 'All') entries = entries.filter(e => e.region === options.region);
    return entries;
  },

  getCurrentUserEntry: (): LeaderboardEntry | undefined =>
    mockLeaderboard.find(e => e.isCurrentUser),
};
