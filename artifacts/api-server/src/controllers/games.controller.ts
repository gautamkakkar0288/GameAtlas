import type { Request, Response, NextFunction } from "express-serve-static-core";
import { db, gamesTable, achievementsTable, reviewsTable, usersTable } from "../../../../lib/db/src/index.js";
import { eq, ilike, or, sql } from "../../../../lib/db/src/index.js";
import { createError } from "../middleware/errorHandler.js";

export async function listGames(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { genre, platform, search, limit = "20", offset = "0" } = req.query;

    let query = db.select().from(gamesTable);

    if (search) {
      query = query.where(
        or(
          ilike(gamesTable.title, `%${search}%`),
          ilike(gamesTable.genre, `%${search}%`),
        )
      ) as typeof query;
    } else if (genre && genre !== "All") {
      query = query.where(ilike(gamesTable.genre, String(genre))) as typeof query;
    } else if (platform && platform !== "All") {
      query = query.where(ilike(gamesTable.platform, String(platform))) as typeof query;
    }

    const games = await query
      .limit(Number(limit))
      .offset(Number(offset));

    res.json({ games, total: games.length });
  } catch (err) {
    next(err);
  }
}

export async function getGame(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const slug = String(req.params["slug"]);

    const [game] = await db
      .select()
      .from(gamesTable)
      .where(eq(gamesTable.slug, slug))
      .limit(1);

    if (!game) {
      throw createError("Game not found", 404, "NOT_FOUND");
    }

    const achievements = await db
      .select()
      .from(achievementsTable)
      .where(eq(achievementsTable.gameId, game.id));

    const reviews = await db
      .select({
        id: reviewsTable.id,
        rating: reviewsTable.rating,
        title: reviewsTable.title,
        reviewText: reviewsTable.reviewText,
        recommended: reviewsTable.recommended,
        playtimeBefore: reviewsTable.playtimeBefore,
        likes: reviewsTable.likes,
        helpful: reviewsTable.helpful,
        createdAt: reviewsTable.createdAt,
        pros: reviewsTable.pros,
        cons: reviewsTable.cons,
        author: {
          id: usersTable.id,
          username: usersTable.username,
          displayName: usersTable.displayName,
          level: usersTable.level,
          avatarColor: usersTable.avatarColor,
        },
      })
      .from(reviewsTable)
      .leftJoin(usersTable, eq(reviewsTable.userId, usersTable.id))
      .where(eq(reviewsTable.gameId, game.id))
      .limit(10);

    res.json({ game, achievements, reviews });
  } catch (err) {
    next(err);
  }
}

export async function getTrending(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const games = await db
      .select()
      .from(gamesTable)
      .orderBy(sql`rating DESC NULLS LAST`)
      .limit(8);

    res.json({ games });
  } catch (err) {
    next(err);
  }
}
