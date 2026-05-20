import type { Achievement, AchievementRarity } from '@/types';
import { mockGames } from '@/lib/mockData';

const rarities: { rarity: AchievementRarity; xp: number }[] = [
  { rarity: 'Common', xp: 10 },
  { rarity: 'Common', xp: 15 },
  { rarity: 'Uncommon', xp: 30 },
  { rarity: 'Rare', xp: 50 },
  { rarity: 'Epic', xp: 100 },
  { rarity: 'Legendary', xp: 500 }
];

const names = ["First Blood", "Master of the Void", "Sharpshooter", "Explorer", "Hoarder", "Speed Demon", "Survivor", "Completionist", "Godlike", "Untouchable", "Pacifist", "Gladiator", "Tactician", "Architect", "Pioneer"];

const generateMockAchievements = (): Achievement[] => {
  return Array.from({ length: 30 }, (_, i) => {
    const isUnlocked = i < 20;
    const rInfo = rarities[Math.floor(Math.random() * rarities.length)];
    const game = mockGames[i % mockGames.length];
    return {
      id: `ach${i + 1}`,
      gameId: game.id,
      gameTitle: game.title,
      name: names[i % names.length],
      description: "Complete a specific challenge in the game to unlock this achievement and earn XP.",
      rarity: rInfo.rarity,
      unlockedAt: isUnlocked ? new Date(Date.now() - Math.random() * 10000000000).toISOString() : null,
      iconUrl: `https://picsum.photos/seed/ach${i + 1}/64/64`,
      xpReward: rInfo.xp
    };
  });
};

const mockAchievements = generateMockAchievements();

export const achievementsService = {
  getAll: () => mockAchievements,
  getUnlocked: () => mockAchievements.filter(a => a.unlockedAt !== null),
  getLocked: () => mockAchievements.filter(a => a.unlockedAt === null),
  getByRarity: (rarity: AchievementRarity | 'All') => rarity === 'All' ? mockAchievements : mockAchievements.filter(a => a.rarity === rarity)
};
