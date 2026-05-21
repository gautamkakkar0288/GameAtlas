export type Platform = 'Steam' | 'Epic' | 'Riot' | 'All';
export type Genre = 'RPG' | 'Action' | 'Strategy' | 'FPS' | 'Adventure' | 'Indie' | 'Sports' | 'Racing' | 'Puzzle' | 'All';
export type GameStatus = 'playing' | 'completed' | 'wishlist' | 'not_started';
export type AchievementRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
export type NewsCategory = 'Esports' | 'AAA' | 'Indie' | 'PlayStation' | 'Xbox' | 'PC' | 'Nintendo' | 'Mobile';
export type UserStatus = 'online' | 'in-game' | 'idle' | 'offline';
export type RankTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | 'Legendary';
export type PostType = 'text' | 'screenshot' | 'clip' | 'achievement' | 'recommendation';
export type ActivityEventType = 'achievement' | 'game_played' | 'review_posted' | 'favorite_added' | 'rank_change';

export interface Achievement {
  id: string;
  gameId: string;
  gameTitle: string;
  name: string;
  description: string;
  rarity: AchievementRarity;
  unlockedAt: string | null; // null = locked
  iconUrl: string;
  xpReward: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  source: string;
  readTime: number;
  category: NewsCategory;
  publishedAt: string;
  featured: boolean;
}

export interface SearchResult {
  id: string;
  type: 'game' | 'player' | 'news';
  title: string;
  subtitle: string;
  imageUrl: string;
  meta?: string;
}
