import type { UserStatus, RankTier, PostType, ActivityEventType } from '@/types';

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarInitials: string;
  avatarColor: string;
  bannerSeed: string;
  level: number;
  xp: number;
  xpToNext: number;
  status: UserStatus;
  joinDate: string;
  favoriteGenre: string;
  favoriteGame: string;
  linkedPlatforms: { name: string; handle: string }[];
  stats: {
    totalPlaytime: number;
    gamesCompleted: number;
    achievementsUnlocked: number;
    multiplayerHours: number;
    rankingScore: number;
  };
  rankTier: RankTier;
}

export interface Post {
  id: string;
  author: {
    id: string;
    username: string;
    avatarInitials: string;
    avatarColor: string;
    level: number;
    status: UserStatus;
  };
  type: PostType;
  content: string;
  imageUrl?: string;
  gameTag?: string;
  timestamp: string;
  reactions: { emoji: string; count: number }[];
  commentsCount: number;
  shares: number;
}

export interface Review {
  id: string;
  gameId: string;
  gameTitle: string;
  gameCoverUrl: string;
  author: {
    id: string;
    username: string;
    avatarInitials: string;
    avatarColor: string;
    level: number;
  };
  rating: number;
  title: string;
  body: string;
  pros: string[];
  cons: string[];
  playtimeBeforeReview: number;
  platform: string;
  likes: number;
  dislikes: number;
  commentsCount: number;
  timestamp: string;
  helpful: number;
  featured: boolean;
  recommended: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  username: string;
  displayName: string;
  avatarInitials: string;
  avatarColor: string;
  level: number;
  rankTier: RankTier;
  score: number;
  winRate: number;
  achievements: number;
  favoriteGame: string;
  platform: string;
  region: string;
  weeklyChange: number;
  isCurrentUser?: boolean;
  isFriend?: boolean;
}

export interface Notification {
  id: string;
  type: 'achievement' | 'friend_activity' | 'review_like' | 'event' | 'rank_change' | 'friend_request';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  avatarInitials?: string;
  avatarColor?: string;
}

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  title: string;
  description: string;
  timestamp: string;
  game?: string;
  iconSeed?: string;
  meta?: string;
}

export interface FriendExtended {
  id: string;
  username: string;
  avatarInitials: string;
  avatarColor: string;
  level: number;
  status: UserStatus;
  currentGame?: string;
  rankTier: RankTier;
  mutualFriends: number;
}

export const mockUserProfile: UserProfile = {
  id: 'u1',
  username: 'PlayerOne',
  displayName: 'PLAYER ONE',
  bio: 'Elite gamer navigating the digital cosmos. RPG enthusiast, strategy mastermind, and champion of impossible achievements. 1,420 hours in the void.',
  avatarInitials: 'P1',
  avatarColor: '#8B0000',
  bannerSeed: 'banner1',
  level: 42,
  xp: 8450,
  xpToNext: 10000,
  status: 'online',
  joinDate: 'January 15, 2023',
  favoriteGenre: 'RPG',
  favoriteGame: 'Void Protocol',
  linkedPlatforms: [
    { name: 'Steam', handle: 'PlayerOne_Steam' },
    { name: 'Epic', handle: 'P1_Epic' },
    { name: 'Discord', handle: 'PlayerOne#1337' },
  ],
  stats: {
    totalPlaytime: 1420,
    gamesCompleted: 16,
    achievementsUnlocked: 324,
    multiplayerHours: 580,
    rankingScore: 94750,
  },
  rankTier: 'Master',
};

export const mockFavoriteGames = [
  { id: 'g1', title: 'Void Protocol', coverUrl: 'https://picsum.photos/seed/g1/400/600', playtime: 124.5, genre: 'RPG' },
  { id: 'g3', title: 'Crimson Covenant', coverUrl: 'https://picsum.photos/seed/g3/400/600', playtime: 312.0, genre: 'Strategy' },
  { id: 'g7', title: 'Phantom Gate', coverUrl: 'https://picsum.photos/seed/g7/400/600', playtime: 210.5, genre: 'RPG' },
  { id: 'g13', title: 'Apex Legends', coverUrl: 'https://picsum.photos/seed/g13/400/600', playtime: 850.5, genre: 'Shooter' },
];

export const mockActivityFeed: ActivityEvent[] = [
  { id: 'ae1', type: 'achievement', title: 'Legendary Unlock', description: 'Unlocked "Master of the Void" in Void Protocol', timestamp: '10 minutes ago', game: 'Void Protocol', meta: 'Legendary' },
  { id: 'ae2', type: 'rank_change', title: 'Rank Up!', description: 'Advanced to Master tier on Global Leaderboard', timestamp: '2 hours ago', meta: '+2 ranks' },
  { id: 'ae3', type: 'game_played', title: 'Session Complete', description: 'Played Crimson Covenant for 3.5 hours', timestamp: '5 hours ago', game: 'Crimson Covenant' },
  { id: 'ae4', type: 'review_posted', title: 'Review Posted', description: 'Wrote a review for Phantom Gate (4.7★)', timestamp: 'Yesterday', game: 'Phantom Gate' },
  { id: 'ae5', type: 'favorite_added', title: 'New Favorite', description: 'Added Apex Legends to your favorites', timestamp: '2 days ago', game: 'Apex Legends' },
  { id: 'ae6', type: 'achievement', title: 'Rare Achievement', description: 'Unlocked "Dragon Slayer" in Crimson Covenant', timestamp: '3 days ago', game: 'Crimson Covenant', meta: 'Rare' },
];

export const mockRareAchievements = [
  { id: 'ra1', name: 'Master of the Void', game: 'Void Protocol', rarity: 'Legendary', percentage: 0.3, iconUrl: 'https://picsum.photos/seed/ach1/80/80', xp: 500 },
  { id: 'ra2', name: 'Dragon Slayer', game: 'Crimson Covenant', rarity: 'Epic', percentage: 2.1, iconUrl: 'https://picsum.photos/seed/ach2/80/80', xp: 250 },
  { id: 'ra3', name: 'Ghost Protocol', game: 'Phantom Gate', rarity: 'Rare', percentage: 5.8, iconUrl: 'https://picsum.photos/seed/ach3/80/80', xp: 150 },
  { id: 'ra4', name: 'Speed Demon', game: 'Cybernetic Drift', rarity: 'Epic', percentage: 1.5, iconUrl: 'https://picsum.photos/seed/ach4/80/80', xp: 300 },
  { id: 'ra5', name: 'Apex Predator', game: 'Apex Legends', rarity: 'Legendary', percentage: 0.7, iconUrl: 'https://picsum.photos/seed/ach5/80/80', xp: 500 },
  { id: 'ra6', name: 'Phantom Lord', game: 'Shadow Protocol', rarity: 'Rare', percentage: 8.2, iconUrl: 'https://picsum.photos/seed/ach6/80/80', xp: 100 },
];

export const mockPosts: Post[] = [
  {
    id: 'p1',
    author: { id: 'u2', username: 'CyberNinja', avatarInitials: 'CN', avatarColor: '#1a1aff', level: 67, status: 'in-game' },
    type: 'screenshot',
    content: 'Just hit Legendary rank in Void Protocol. The final boss took 47 attempts but the feeling when you finally pull it off is indescribable. This game is a masterpiece.',
    imageUrl: 'https://picsum.photos/seed/post1/800/450',
    gameTag: 'Void Protocol',
    timestamp: '12 minutes ago',
    reactions: [{ emoji: '🔥', count: 147 }, { emoji: '💀', count: 89 }, { emoji: '⚡', count: 56 }],
    commentsCount: 34,
    shares: 12,
  },
  {
    id: 'p2',
    author: { id: 'u3', username: 'GlitchQueen', avatarInitials: 'GQ', avatarColor: '#9333ea', level: 55, status: 'online' },
    type: 'achievement',
    content: 'FINALLY unlocked the Platinum trophy on Crimson Covenant after 312 hours. If anyone needs tips on the "Dragon Slayer" achievement — hit my DMs. Worth every second.',
    gameTag: 'Crimson Covenant',
    timestamp: '1 hour ago',
    reactions: [{ emoji: '🏆', count: 203 }, { emoji: '🔥', count: 91 }, { emoji: '👑', count: 74 }],
    commentsCount: 67,
    shares: 28,
  },
  {
    id: 'p3',
    author: { id: 'u4', username: 'VoidWalker', avatarInitials: 'VW', avatarColor: '#059669', level: 38, status: 'in-game' },
    type: 'recommendation',
    content: 'Guys if you haven\'t tried Phantom Gate yet — what are you doing? 10/10 story, incredible world building. It hits different at 2am with headphones on. Easily my GOTY.',
    imageUrl: 'https://picsum.photos/seed/g7/800/450',
    gameTag: 'Phantom Gate',
    timestamp: '3 hours ago',
    reactions: [{ emoji: '💯', count: 312 }, { emoji: '🎮', count: 145 }, { emoji: '🌙', count: 88 }],
    commentsCount: 112,
    shares: 45,
  },
  {
    id: 'p4',
    author: { id: 'u5', username: 'NeonPhantom', avatarInitials: 'NP', avatarColor: '#dc2626', level: 91, status: 'online' },
    type: 'clip',
    content: 'Clutch 1v5 in Shadow Protocol to win the tournament finals. Heart was pounding the whole time. This clip doesn\'t do justice to the adrenaline.',
    imageUrl: 'https://picsum.photos/seed/post4/800/450',
    gameTag: 'Shadow Protocol',
    timestamp: '5 hours ago',
    reactions: [{ emoji: '😱', count: 891 }, { emoji: '🔥', count: 556 }, { emoji: '⚡', count: 234 }],
    commentsCount: 289,
    shares: 167,
  },
  {
    id: 'p5',
    author: { id: 'u6', username: 'PixelPaladin', avatarInitials: 'PP', avatarColor: '#d97706', level: 29, status: 'idle' },
    type: 'text',
    content: 'Hot take: Cybernetic Drift has the best soundtrack of any racing game ever made. The bass drops sync perfectly with the boost mechanics. Pure engineering genius from the devs.',
    gameTag: 'Cybernetic Drift',
    timestamp: '8 hours ago',
    reactions: [{ emoji: '🎵', count: 178 }, { emoji: '💯', count: 92 }, { emoji: '🎮', count: 44 }],
    commentsCount: 56,
    shares: 19,
  },
];

export const mockTrendingGames = [
  { id: 'g1', title: 'Void Protocol', genre: 'RPG', coverUrl: 'https://picsum.photos/seed/g1/80/80', players: '14.2K', trend: '+23%' },
  { id: 'g3', title: 'Crimson Covenant', genre: 'Strategy', coverUrl: 'https://picsum.photos/seed/g3/80/80', players: '9.8K', trend: '+15%' },
  { id: 'g13', title: 'Apex Legends', genre: 'Shooter', coverUrl: 'https://picsum.photos/seed/g13/80/80', players: '28.5K', trend: '+8%' },
  { id: 'g4', title: 'Shadow Protocol', genre: 'Shooter', coverUrl: 'https://picsum.photos/seed/g4/80/80', players: '6.1K', trend: '+41%' },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, playerId: 'lb1', username: 'ShadowReaper', displayName: 'SHADOW REAPER', avatarInitials: 'SR', avatarColor: '#eab308', level: 99, rankTier: 'Legendary', score: 287450, winRate: 78.4, achievements: 892, favoriteGame: 'Void Protocol', platform: 'Steam', region: 'NA', weeklyChange: 0 },
  { rank: 2, playerId: 'lb2', username: 'VoidMaster', displayName: 'VOID MASTER', avatarInitials: 'VM', avatarColor: '#a855f7', level: 96, rankTier: 'Legendary', score: 265120, winRate: 74.2, achievements: 847, favoriteGame: 'Shadow Protocol', platform: 'Riot', region: 'EU', weeklyChange: 1 },
  { rank: 3, playerId: 'lb3', username: 'NeonReaver', displayName: 'NEON REAVER', avatarInitials: 'NR', avatarColor: '#3b82f6', level: 93, rankTier: 'Master', score: 251890, winRate: 71.1, achievements: 791, favoriteGame: 'Apex Legends', platform: 'Epic', region: 'AS', weeklyChange: -1 },
  { rank: 4, playerId: 'lb4', username: 'CyberNinja', displayName: 'CYBER NINJA', avatarInitials: 'CN', avatarColor: '#1a1aff', level: 67, rankTier: 'Diamond', score: 198340, winRate: 65.8, achievements: 634, favoriteGame: 'Void Protocol', platform: 'Steam', region: 'NA', weeklyChange: 2, isFriend: true },
  { rank: 5, playerId: 'lb5', username: 'GlitchQueen', displayName: 'GLITCH QUEEN', avatarInitials: 'GQ', avatarColor: '#9333ea', level: 55, rankTier: 'Diamond', score: 175220, winRate: 61.3, achievements: 542, favoriteGame: 'Crimson Covenant', platform: 'Steam', region: 'EU', weeklyChange: -2, isFriend: true },
  { rank: 6, playerId: 'lb6', username: 'PixelWarrior', displayName: 'PIXEL WARRIOR', avatarInitials: 'PW', avatarColor: '#10b981', level: 48, rankTier: 'Platinum', score: 142890, winRate: 57.9, achievements: 421, favoriteGame: 'Neon Dynasty', platform: 'Epic', region: 'SA', weeklyChange: 3 },
  { rank: 7, playerId: 'u1', username: 'PlayerOne', displayName: 'PLAYER ONE', avatarInitials: 'P1', avatarColor: '#8B0000', level: 42, rankTier: 'Master', score: 94750, winRate: 54.2, achievements: 324, favoriteGame: 'Void Protocol', platform: 'Steam', region: 'NA', weeklyChange: 2, isCurrentUser: true },
  { rank: 8, playerId: 'lb8', username: 'VoidWalker', displayName: 'VOID WALKER', avatarInitials: 'VW', avatarColor: '#059669', level: 38, rankTier: 'Gold', score: 87230, winRate: 51.6, achievements: 287, favoriteGame: 'Phantom Gate', platform: 'Steam', region: 'EU', weeklyChange: -1, isFriend: true },
  { rank: 9, playerId: 'lb9', username: 'ArcaneHunter', displayName: 'ARCANE HUNTER', avatarInitials: 'AH', avatarColor: '#f59e0b', level: 33, rankTier: 'Gold', score: 72140, winRate: 48.3, achievements: 231, favoriteGame: 'Bloodline Requiem', platform: 'Steam', region: 'NA', weeklyChange: 0 },
  { rank: 10, playerId: 'lb10', username: 'IronWraith', displayName: 'IRON WRAITH', avatarInitials: 'IW', avatarColor: '#6366f1', level: 29, rankTier: 'Silver', score: 58670, winRate: 44.1, achievements: 178, favoriteGame: 'Iron Vanguard', platform: 'Steam', region: 'AS', weeklyChange: 4 },
];

export const mockReviews: Review[] = [
  {
    id: 'r1',
    gameId: 'g1',
    gameTitle: 'Void Protocol',
    gameCoverUrl: 'https://picsum.photos/seed/g1/400/600',
    author: { id: 'lb1', username: 'ShadowReaper', avatarInitials: 'SR', avatarColor: '#eab308', level: 99 },
    rating: 5,
    title: 'A Transcendent RPG Experience That Redefines the Genre',
    body: 'Void Protocol is not just a game — it\'s an experience that fundamentally changes how you look at narrative-driven RPGs. The story layers unfold like an intricate puzzle box, each revelation more jaw-dropping than the last. The combat system is deep without being overwhelming, and the world design feels truly alien and alive. I\'ve put in 200+ hours and still discover new things.',
    pros: ['Masterful storytelling', 'Deep, rewarding combat', 'Stunning art direction', 'Hundreds of hours of content'],
    cons: ['Minor performance issues at launch', 'Some side quests feel filler'],
    playtimeBeforeReview: 200,
    platform: 'Steam',
    likes: 1247,
    dislikes: 23,
    commentsCount: 89,
    timestamp: '2 days ago',
    helpful: 94,
    featured: true,
    recommended: true,
  },
  {
    id: 'r2',
    gameId: 'g3',
    gameTitle: 'Crimson Covenant',
    gameCoverUrl: 'https://picsum.photos/seed/g3/400/600',
    author: { id: 'u3', username: 'GlitchQueen', avatarInitials: 'GQ', avatarColor: '#9333ea', level: 55 },
    rating: 4.5,
    title: 'Grand Strategy at Its Absolute Finest',
    body: 'If you\'re a fan of grand strategy games, Crimson Covenant is unmissable. The vampire clan mechanics add a layer of uniqueness that keeps every campaign feeling fresh. The diplomacy system is nuanced and the late-game snowball is incredibly satisfying. A few UI quirks hold it back from perfection but the core experience is outstanding.',
    pros: ['Unique vampire mechanics', 'Deep diplomacy system', 'High replayability', 'Great modding support'],
    cons: ['Steep learning curve', 'UI can be cluttered', 'AI sometimes passive in late game'],
    playtimeBeforeReview: 312,
    platform: 'Steam',
    likes: 892,
    dislikes: 41,
    commentsCount: 134,
    timestamp: '1 week ago',
    helpful: 89,
    featured: false,
    recommended: true,
  },
  {
    id: 'r3',
    gameId: 'g7',
    gameTitle: 'Phantom Gate',
    gameCoverUrl: 'https://picsum.photos/seed/g7/400/600',
    author: { id: 'u4', username: 'VoidWalker', avatarInitials: 'VW', avatarColor: '#059669', level: 38 },
    rating: 4.7,
    title: 'Old-School JRPG Magic With Modern Presentation',
    body: 'Phantom Gate captures the heart of classic JRPGs while delivering a visual experience that rivals modern AAA titles. The party system is deep, the story is emotionally impactful, and the soundtrack is absolutely legendary. If you grew up on Final Fantasy and Xenogears this will hit you right in the nostalgia while feeling completely fresh.',
    pros: ['Incredible soundtrack', 'Deep party system', 'Emotional narrative', 'Gorgeous visuals'],
    cons: ['Random encounters can get tedious', 'Some backtracking'],
    playtimeBeforeReview: 210,
    platform: 'Steam',
    likes: 743,
    dislikes: 18,
    commentsCount: 67,
    timestamp: '2 weeks ago',
    helpful: 96,
    featured: false,
    recommended: true,
  },
  {
    id: 'r4',
    gameId: 'g13',
    gameTitle: 'Apex Legends',
    gameCoverUrl: 'https://picsum.photos/seed/g13/400/600',
    author: { id: 'lb2', username: 'VoidMaster', avatarInitials: 'VM', avatarColor: '#a855f7', level: 96 },
    rating: 4.3,
    title: 'The Battle Royale That Never Gets Old',
    body: 'After 850+ hours, Apex Legends remains the most skill-expressive battle royale on the market. The movement system has a depth that takes hundreds of hours to master, and the legend synergy in team compositions creates genuinely strategic gameplay. The live service model keeps content fresh. Some monetization practices are questionable but the core game is excellent.',
    pros: ['Best movement in genre', 'High skill ceiling', 'Regular content updates', 'Strong team dynamics'],
    cons: ['Aggressive monetization', 'Matchmaking inconsistency', 'Server issues occasionally'],
    playtimeBeforeReview: 850,
    platform: 'Epic',
    likes: 2140,
    dislikes: 234,
    commentsCount: 412,
    timestamp: '3 days ago',
    helpful: 82,
    featured: false,
    recommended: true,
  },
];

export const mockNotifications: Notification[] = [
  { id: 'n1', type: 'achievement', title: 'Achievement Unlocked!', message: '"Master of the Void" — Void Protocol (Legendary)', timestamp: '10 minutes ago', read: false, avatarInitials: '🏆', avatarColor: '#eab308' },
  { id: 'n2', type: 'rank_change', title: 'Rank Increased!', message: 'You climbed to #7 on the Global Leaderboard', timestamp: '2 hours ago', read: false, avatarInitials: '⬆', avatarColor: '#22c55e' },
  { id: 'n3', type: 'friend_activity', title: 'CyberNinja is now online', message: 'Currently playing Void Protocol', timestamp: '3 hours ago', read: false, avatarInitials: 'CN', avatarColor: '#1a1aff' },
  { id: 'n4', type: 'review_like', title: 'Your review got 50 likes', message: 'Your Phantom Gate review is trending', timestamp: '5 hours ago', read: true, avatarInitials: '❤', avatarColor: '#ef4444' },
  { id: 'n5', type: 'event', title: 'Tournament Starting Soon', message: 'Void Protocol Championship begins in 2 hours', timestamp: '1 day ago', read: true, avatarInitials: '🎮', avatarColor: '#8B0000' },
  { id: 'n6', type: 'friend_request', title: 'Friend Request', message: 'NeonPhantom wants to connect', timestamp: '2 days ago', read: true, avatarInitials: 'NP', avatarColor: '#dc2626' },
];

export const mockFriendsExtended: FriendExtended[] = [
  { id: 'f1', username: 'CyberNinja', avatarInitials: 'CN', avatarColor: '#1a1aff', level: 67, status: 'in-game', currentGame: 'Void Protocol', rankTier: 'Diamond', mutualFriends: 3 },
  { id: 'f2', username: 'GlitchQueen', avatarInitials: 'GQ', avatarColor: '#9333ea', level: 55, status: 'online', rankTier: 'Diamond', mutualFriends: 5 },
  { id: 'f3', username: 'PixelPaladin', avatarInitials: 'PP', avatarColor: '#d97706', level: 29, status: 'idle', rankTier: 'Silver', mutualFriends: 2 },
  { id: 'f4', username: 'VoidWalker', avatarInitials: 'VW', avatarColor: '#059669', level: 38, status: 'in-game', currentGame: 'Crimson Covenant', rankTier: 'Gold', mutualFriends: 7 },
];

export const rankTierConfig: Record<string, { color: string; glow: string; gradient: string }> = {
  Bronze: { color: '#cd7f32', glow: 'rgba(205,127,50,0.6)', gradient: 'from-amber-700 to-orange-800' },
  Silver: { color: '#c0c0c0', glow: 'rgba(192,192,192,0.6)', gradient: 'from-gray-400 to-gray-600' },
  Gold: { color: '#ffd700', glow: 'rgba(255,215,0,0.6)', gradient: 'from-yellow-400 to-yellow-600' },
  Platinum: { color: '#e5e4e2', glow: 'rgba(229,228,226,0.6)', gradient: 'from-slate-300 to-slate-500' },
  Diamond: { color: '#b9f2ff', glow: 'rgba(185,242,255,0.6)', gradient: 'from-cyan-300 to-blue-500' },
  Master: { color: '#ef4444', glow: 'rgba(239,68,68,0.6)', gradient: 'from-red-500 to-red-800' },
  Legendary: { color: '#eab308', glow: 'rgba(234,179,8,0.8)', gradient: 'from-yellow-400 via-orange-500 to-red-600' },
};
