import type { Request, Response, NextFunction } from "express-serve-static-core";
import { db, gamesTable, userGameLibraryTable, userAchievementsTable } from "../../../../lib/db/src/index.js";
import { eq, inArray } from "../../../../lib/db/src/index.js";

type GamerArchetype =
  | "Story Explorer"
  | "Achievement Addict"
  | "Competitive Grinder"
  | "Completionist"
  | "Indie Hunter"
  | "RPG Collector"
  | "Casual Arcade Player"
  | "Tactical Strategist"
  | "Social Gamer";

const ARCHETYPE_META: Record<GamerArchetype, { description: string; rarity: string; color: string; icon: string }> = {
  "Story Explorer": {
    description: "You live for immersive narratives and rich worlds. Every game is a new adventure.",
    rarity: "Rare", color: "#8b5cf6", icon: "📖",
  },
  "Achievement Addict": {
    description: "Trophies, badges, completions — you hunt every unlock with surgical precision.",
    rarity: "Epic", color: "#f59e0b", icon: "🏆",
  },
  "Competitive Grinder": {
    description: "The leaderboard is your domain. You push limits until you claim the top spot.",
    rarity: "Legendary", color: "#ef4444", icon: "⚔️",
  },
  "Completionist": {
    description: "You don't stop until every quest is done, every secret found, every percent unlocked.",
    rarity: "Epic", color: "#10b981", icon: "✅",
  },
  "Indie Hunter": {
    description: "You discover gems before they're mainstream. Your taste is ahead of the curve.",
    rarity: "Rare", color: "#06b6d4", icon: "💎",
  },
  "RPG Collector": {
    description: "Your library is a museum of epic adventures, character builds, and legendary loot.",
    rarity: "Uncommon", color: "#6366f1", icon: "🗡️",
  },
  "Casual Arcade Player": {
    description: "Quick sessions, instant fun. You play to enjoy, not to conquer.",
    rarity: "Common", color: "#84cc16", icon: "🕹️",
  },
  "Tactical Strategist": {
    description: "Every move is calculated. You outthink opponents and master every system.",
    rarity: "Rare", color: "#f97316", icon: "🧠",
  },
  "Social Gamer": {
    description: "Gaming is better together. You connect, share, and build community.",
    rarity: "Uncommon", color: "#ec4899", icon: "👥",
  },
};

export async function getGamerDNA(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;

    const library = await db
      .select({ gameId: userGameLibraryTable.gameId, playtime: userGameLibraryTable.playtime, status: userGameLibraryTable.status })
      .from(userGameLibraryTable)
      .where(eq(userGameLibraryTable.userId, userId));

    const libraryGameIds = library.map((e) => e.gameId);
    const genreAffinity: Record<string, number> = {};

    if (libraryGameIds.length > 0) {
      const libraryGames = await db
        .select({ genre: gamesTable.genre })
        .from(gamesTable)
        .where(inArray(gamesTable.id, libraryGameIds));
      for (const g of libraryGames) {
        genreAffinity[g.genre] = (genreAffinity[g.genre] ?? 0) + 1;
      }
    }

    const unlockedAchievements = await db
      .select({ id: userAchievementsTable.id })
      .from(userAchievementsTable)
      .where(eq(userAchievementsTable.userId, userId));

    const totalPlaytime = library.reduce((acc, e) => acc + e.playtime, 0);
    const completedCount = library.filter((e) => e.status === "completed").length;
    const completionRate = library.length > 0 ? completedCount / library.length : 0;
    const avgPlaytime = library.length > 0 ? totalPlaytime / library.length : 0;

    const scores: Record<GamerArchetype, number> = {
      "Story Explorer": (genreAffinity["RPG"] ?? 0) * 2 + (genreAffinity["Adventure"] ?? 0) * 2,
      "Achievement Addict": unlockedAchievements.length * 2 + completedCount * 2,
      "Competitive Grinder": avgPlaytime > 10 ? 15 + totalPlaytime * 0.02 : 0,
      "Completionist": Math.floor(completionRate * 20),
      "Indie Hunter": (genreAffinity["Indie"] ?? 0) * 5,
      "RPG Collector": (genreAffinity["RPG"] ?? 0) * 4,
      "Casual Arcade Player": library.length >= 3 && avgPlaytime < 5 ? 12 : 0,
      "Tactical Strategist": (genreAffinity["Strategy"] ?? 0) * 4 + (genreAffinity["FPS"] ?? 0) * 2,
      "Social Gamer": (genreAffinity["Sports"] ?? 0) * 3 + library.length * 0.3,
    };

    if (Object.values(scores).every((v) => v === 0)) {
      scores["Story Explorer"] = 5;
    }

    const archetype = (Object.entries(scores).sort((a, b) => b[1] - a[1])[0]![0]) as GamerArchetype;
    const meta = ARCHETYPE_META[archetype];
    const topGenre = Object.entries(genreAffinity).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Mixed";

    const playstyleBreakdown = [
      { label: "Exploration", value: Math.min(100, ((genreAffinity["RPG"] ?? 0) + (genreAffinity["Adventure"] ?? 0)) * 15) },
      { label: "Competition", value: Math.min(100, Math.round(totalPlaytime * 0.8)) },
      { label: "Collection", value: Math.min(100, library.length * 8) },
      { label: "Completion", value: Math.min(100, Math.round(completionRate * 100)) },
      { label: "Discovery", value: Math.min(100, (genreAffinity["Indie"] ?? 0) * 25 + (genreAffinity["Puzzle"] ?? 0) * 15) },
    ];

    res.json({
      dna: {
        archetype,
        topGenre,
        description: meta.description,
        rarity: meta.rarity,
        color: meta.color,
        icon: meta.icon,
        genreAffinity,
        playstyleBreakdown,
      },
    });
  } catch (err) {
    next(err);
  }
}
