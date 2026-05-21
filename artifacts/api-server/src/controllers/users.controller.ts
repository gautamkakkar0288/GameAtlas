import type { Request, Response, NextFunction } from "express-serve-static-core";
import { db, usersTable, userGameLibraryTable, userAchievementsTable, achievementsTable, userPreferencesTable } from "../../../../lib/db/src/index.js";
import { eq } from "../../../../lib/db/src/index.js";
import { updateProfileSchema } from "../../../../lib/db/src/schema/index.js";
import { createError } from "../middleware/errorHandler.js";

export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;

    const [user] = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        username: usersTable.username,
        displayName: usersTable.displayName,
        bio: usersTable.bio,
        level: usersTable.level,
        xp: usersTable.xp,
        avatarColor: usersTable.avatarColor,
        rankTier: usersTable.rankTier,
        favoriteGenre: usersTable.favoriteGenre,
        favoriteGame: usersTable.favoriteGame,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user) throw createError("User not found", 404, "NOT_FOUND");

    const library = await db
      .select({ status: userGameLibraryTable.status, playtime: userGameLibraryTable.playtime })
      .from(userGameLibraryTable)
      .where(eq(userGameLibraryTable.userId, userId));

    const unlockedAchievements = await db
      .select({ id: userAchievementsTable.id })
      .from(userAchievementsTable)
      .where(eq(userAchievementsTable.userId, userId));

    const totalPlaytime = library.reduce((sum, e) => sum + (e.playtime ?? 0), 0);
    const gamesCompleted = library.filter(e => e.status === "completed").length;

    res.json({
      user,
      stats: {
        totalPlaytime: Math.round(totalPlaytime * 10) / 10,
        gamesCompleted,
        achievementsUnlocked: unlockedAchievements.length,
        gamesInLibrary: library.length,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Profile updates',
        required: true,
        schema: {
            displayName: "New Name",
            bio: "I love games"
        }
  } */
  try {
    const userId = req.user!.userId;
    const parsed = updateProfileSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: "VALIDATION_ERROR", issues: parsed.error.issues });
      return;
    }

    const updates: Record<string, unknown> = { ...parsed.data, updatedAt: new Date() };

    const [updated] = await db
      .update(usersTable)
      .set(updates)
      .where(eq(usersTable.id, userId))
      .returning({
        id: usersTable.id,
        username: usersTable.username,
        displayName: usersTable.displayName,
        bio: usersTable.bio,
        level: usersTable.level,
        xp: usersTable.xp,
        avatarColor: usersTable.avatarColor,
        rankTier: usersTable.rankTier,
        favoriteGenre: usersTable.favoriteGenre,
        favoriteGame: usersTable.favoriteGame,
      });

    if (!updated) throw createError("User not found", 404, "NOT_FOUND");

    res.json({ user: updated });
  } catch (err) {
    next(err);
  }
}

export async function getUserAchievements(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;

    const achievements = await db
      .select({
        id: achievementsTable.id,
        title: achievementsTable.title,
        description: achievementsTable.description,
        rarity: achievementsTable.rarity,
        iconUrl: achievementsTable.iconUrl,
        xpReward: achievementsTable.xpReward,
        rarityPercent: achievementsTable.rarityPercent,
        gameId: achievementsTable.gameId,
        unlockedAt: userAchievementsTable.unlockedAt,
      })
      .from(userAchievementsTable)
      .leftJoin(achievementsTable, eq(userAchievementsTable.achievementId, achievementsTable.id))
      .where(eq(userAchievementsTable.userId, userId));

    res.json({ achievements });
  } catch (err) {
    next(err);
  }
}

export async function saveOnboarding(req: Request, res: Response, next: NextFunction): Promise<void> {
  /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Onboarding preferences',
        required: true,
        schema: {
            favoriteGenres: ["RPG", "Action"],
            playStyle: "hardcore"
        }
  } */
  try {
    const userId = req.user!.userId;
    const { favoriteGenres = [], playStyle = "casual" } = req.body as { favoriteGenres?: string[]; playStyle?: string };

    const existing = await db
      .select({ id: userPreferencesTable.id })
      .from(userPreferencesTable)
      .where(eq(userPreferencesTable.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(userPreferencesTable)
        .set({ favoriteGenres, playStyle, onboardingCompleted: true, updatedAt: new Date() })
        .where(eq(userPreferencesTable.userId, userId));
    } else {
      await db.insert(userPreferencesTable).values({ userId, favoriteGenres, playStyle, onboardingCompleted: true });
    }

    res.json({ message: "Preferences saved" });
  } catch (err) {
    next(err);
  }
}

export async function getOnboardingStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;

    const [prefs] = await db
      .select()
      .from(userPreferencesTable)
      .where(eq(userPreferencesTable.userId, userId))
      .limit(1);

    res.json({
      completed: prefs?.onboardingCompleted ?? false,
      preferences: prefs
        ? { favoriteGenres: prefs.favoriteGenres ?? [], playStyle: prefs.playStyle ?? "casual" }
        : null,
    });
  } catch (err) {
    next(err);
  }
}
