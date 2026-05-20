import type { Request, Response, NextFunction } from "express-serve-static-core";
import { db, usersTable, userAchievementsTable, userGameLibraryTable, reviewsTable } from "../../../../lib/db/src/index.js";
import { eq, sql } from "../../../../lib/db/src/index.js";

export async function getLeaderboard(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await db
      .select({
        id: usersTable.id,
        username: usersTable.username,
        displayName: usersTable.displayName,
        avatarColor: usersTable.avatarColor,
        level: usersTable.level,
        xp: usersTable.xp,
        rankTier: usersTable.rankTier,
        favoriteGame: usersTable.favoriteGame,
        favoriteGenre: usersTable.favoriteGenre,
      })
      .from(usersTable)
      .limit(50);

    const achievementCounts = await db
      .select({
        userId: userAchievementsTable.userId,
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(userAchievementsTable)
      .groupBy(userAchievementsTable.userId);

    const libraryStats = await db
      .select({
        userId: userGameLibraryTable.userId,
        totalPlaytime: sql<number>`cast(coalesce(sum(playtime), 0) as float)`,
        gameCount: sql<number>`cast(count(*) as int)`,
      })
      .from(userGameLibraryTable)
      .groupBy(userGameLibraryTable.userId);

    const reviewCounts = await db
      .select({
        userId: reviewsTable.userId,
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(reviewsTable)
      .groupBy(reviewsTable.userId);

    const achieveMap = new Map(achievementCounts.map((a) => [a.userId, a.count]));
    const libraryMap = new Map(libraryStats.map((l) => [l.userId, l]));
    const reviewMap = new Map(reviewCounts.map((r) => [r.userId, r.count]));

    const ranked = users
      .map((user) => {
        const achievements = achieveMap.get(user.id) ?? 0;
        const lib = libraryMap.get(user.id);
        const playtime = lib?.totalPlaytime ?? 0;
        const games = lib?.gameCount ?? 0;
        const reviews = reviewMap.get(user.id) ?? 0;
        const score = Math.round(achievements * 100 + playtime * 1 + reviews * 50 + user.level * 200);
        return {
          ...user,
          achievementsUnlocked: achievements,
          totalPlaytime: Math.round(playtime),
          gamesInLibrary: games,
          reviewsWritten: reviews,
          score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

    res.json({ leaderboard: ranked });
  } catch (err) {
    next(err);
  }
}
