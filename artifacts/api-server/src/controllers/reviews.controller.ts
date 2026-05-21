import type { Request, Response, NextFunction } from "express-serve-static-core";
import { db, reviewsTable, gamesTable, usersTable } from "../../../../lib/db/src/index.js";
import { eq, desc, sql } from "../../../../lib/db/src/index.js";
import { insertReviewSchema } from "../../../../lib/db/src/schema/index.js";
import { createError } from "../middleware/errorHandler.js";

const reviewWithAuthor = {
  id: reviewsTable.id,
  rating: reviewsTable.rating,
  title: reviewsTable.title,
  reviewText: reviewsTable.reviewText,
  pros: reviewsTable.pros,
  cons: reviewsTable.cons,
  recommended: reviewsTable.recommended,
  playtimeBefore: reviewsTable.playtimeBefore,
  likes: reviewsTable.likes,
  helpful: reviewsTable.helpful,
  featured: reviewsTable.featured,
  createdAt: reviewsTable.createdAt,
  game: {
    id: gamesTable.id,
    slug: gamesTable.slug,
    title: gamesTable.title,
    coverImage: gamesTable.coverImage,
    platform: gamesTable.platform,
  },
  author: {
    id: usersTable.id,
    username: usersTable.username,
    displayName: usersTable.displayName,
    level: usersTable.level,
    avatarColor: usersTable.avatarColor,
  },
};

export async function listReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { gameId, sort = "newest", limit = "20", offset = "0" } = req.query;

    let orderCol = desc(reviewsTable.createdAt);
    if (sort === "rating") orderCol = desc(reviewsTable.rating);
    if (sort === "helpful") orderCol = desc(reviewsTable.helpful);
    if (sort === "controversial") orderCol = desc(reviewsTable.likes);

    let query = db
      .select(reviewWithAuthor)
      .from(reviewsTable)
      .leftJoin(gamesTable, eq(reviewsTable.gameId, gamesTable.id))
      .leftJoin(usersTable, eq(reviewsTable.userId, usersTable.id));

    if (gameId) {
      query = query.where(eq(reviewsTable.gameId, Number(gameId))) as typeof query;
    }

    const reviews = await query
      .orderBy(orderCol)
      .limit(Number(limit))
      .offset(Number(offset));

    res.json({ reviews });
  } catch (err) {
    next(err);
  }
}

export async function getFeaturedReview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [review] = await db
      .select(reviewWithAuthor)
      .from(reviewsTable)
      .leftJoin(gamesTable, eq(reviewsTable.gameId, gamesTable.id))
      .leftJoin(usersTable, eq(reviewsTable.userId, usersTable.id))
      .where(eq(reviewsTable.featured, true))
      .limit(1);

    res.json({ review: review ?? null });
  } catch (err) {
    next(err);
  }
}

export async function createReview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const parsed = insertReviewSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: "VALIDATION_ERROR", issues: parsed.error.issues });
      return;
    }

    const [review] = await db
      .insert(reviewsTable)
      .values({ userId, ...parsed.data })
      .returning();

    res.status(201).json({ review });
  } catch (err) {
    next(err);
  }
}

export async function likeReview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const reviewId = Number(req.params.id);

    const [updated] = await db
      .update(reviewsTable)
      .set({ likes: sql`${reviewsTable.likes} + 1` })
      .where(eq(reviewsTable.id, reviewId))
      .returning({ likes: reviewsTable.likes });

    if (!updated) throw createError("Review not found", 404, "NOT_FOUND");

    res.json({ likes: updated.likes });
  } catch (err) {
    next(err);
  }
}
