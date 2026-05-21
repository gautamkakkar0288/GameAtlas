import type { Request, Response, NextFunction } from "express-serve-static-core";
import { db, userGameLibraryTable, gamesTable } from "../../../../lib/db/src/index.js";
import { eq, and } from "../../../../lib/db/src/index.js";
import { z } from "zod";
import { createError } from "../middleware/errorHandler.js";

const addGameSchema = z.object({
  gameId: z.number().int().positive(),
  status: z.enum(["playing", "completed", "wishlist", "not_started"]).optional(),
});

const updateLibrarySchema = z.object({
  status: z.enum(["playing", "completed", "wishlist", "not_started"]).optional(),
  playtime: z.number().min(0).optional(),
  favorite: z.boolean().optional(),
});

export async function getUserLibrary(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;

    const library = await db
      .select({
        id: userGameLibraryTable.id,
        playtime: userGameLibraryTable.playtime,
        status: userGameLibraryTable.status,
        favorite: userGameLibraryTable.favorite,
        lastPlayed: userGameLibraryTable.lastPlayed,
        addedAt: userGameLibraryTable.addedAt,
        game: {
          id: gamesTable.id,
          slug: gamesTable.slug,
          title: gamesTable.title,
          genre: gamesTable.genre,
          platform: gamesTable.platform,
          coverImage: gamesTable.coverImage,
          rating: gamesTable.rating,
          releaseYear: gamesTable.releaseYear,
          description: gamesTable.description,
        },
      })
      .from(userGameLibraryTable)
      .leftJoin(gamesTable, eq(userGameLibraryTable.gameId, gamesTable.id))
      .where(eq(userGameLibraryTable.userId, userId));

    res.json({ library });
  } catch (err) {
    next(err);
  }
}

export async function addToLibrary(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const parsed = addGameSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: "VALIDATION_ERROR", issues: parsed.error.issues });
      return;
    }

    const { gameId, status = "not_started" } = parsed.data;

    const [existing] = await db
      .select({ id: userGameLibraryTable.id })
      .from(userGameLibraryTable)
      .where(and(eq(userGameLibraryTable.userId, userId), eq(userGameLibraryTable.gameId, gameId)))
      .limit(1);

    if (existing) {
      throw createError("Game already in library", 409, "ALREADY_IN_LIBRARY");
    }

    const [entry] = await db
      .insert(userGameLibraryTable)
      .values({ userId, gameId, status })
      .returning();

    res.status(201).json({ entry });
  } catch (err) {
    next(err);
  }
}

export async function updateLibraryEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const gameId = Number(req.params.gameId);

    const parsed = updateLibrarySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "VALIDATION_ERROR", issues: parsed.error.issues });
      return;
    }

    const updates: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.status === "playing") {
      updates.lastPlayed = new Date();
    }

    const [updated] = await db
      .update(userGameLibraryTable)
      .set(updates)
      .where(and(eq(userGameLibraryTable.userId, userId), eq(userGameLibraryTable.gameId, gameId)))
      .returning();

    if (!updated) {
      throw createError("Library entry not found", 404, "NOT_FOUND");
    }

    res.json({ entry: updated });
  } catch (err) {
    next(err);
  }
}

export async function removeFromLibrary(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const gameId = Number(req.params.gameId);

    await db
      .delete(userGameLibraryTable)
      .where(and(eq(userGameLibraryTable.userId, userId), eq(userGameLibraryTable.gameId, gameId)));

    res.json({ message: "Removed from library" });
  } catch (err) {
    next(err);
  }
}
