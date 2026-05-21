import type { Request, Response, NextFunction } from "express-serve-static-core";
import { db, postsTable, usersTable, commentsTable } from "../../../../lib/db/src/index.js";
import { eq, desc, sql } from "../../../../lib/db/src/index.js";
import { insertPostSchema } from "../../../../lib/db/src/schema/index.js";
import { createError } from "../middleware/errorHandler.js";

const postWithAuthor = {
  id: postsTable.id,
  type: postsTable.type,
  content: postsTable.content,
  imageUrl: postsTable.imageUrl,
  gameTag: postsTable.gameTag,
  likes: postsTable.likes,
  commentsCount: postsTable.commentsCount,
  shares: postsTable.shares,
  createdAt: postsTable.createdAt,
  author: {
    id: usersTable.id,
    username: usersTable.username,
    displayName: usersTable.displayName,
    avatarColor: usersTable.avatarColor,
    level: usersTable.level,
    rankTier: usersTable.rankTier,
  },
};

export async function listPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { type, limit = "20", offset = "0" } = req.query;

    let query = db
      .select(postWithAuthor)
      .from(postsTable)
      .leftJoin(usersTable, eq(postsTable.userId, usersTable.id));

    if (type && type !== "all") {
      query = query.where(eq(postsTable.type, String(type))) as typeof query;
    }

    const posts = await query
      .orderBy(desc(postsTable.createdAt))
      .limit(Number(limit))
      .offset(Number(offset));

    res.json({ posts });
  } catch (err) {
    next(err);
  }
}

export async function createPost(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const parsed = insertPostSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: "VALIDATION_ERROR", issues: parsed.error.issues });
      return;
    }

    const [post] = await db
      .insert(postsTable)
      .values({ userId, ...parsed.data })
      .returning();

    const [postWithUser] = await db
      .select(postWithAuthor)
      .from(postsTable)
      .leftJoin(usersTable, eq(postsTable.userId, usersTable.id))
      .where(eq(postsTable.id, post.id))
      .limit(1);

    res.status(201).json({ post: postWithUser });
  } catch (err) {
    next(err);
  }
}

export async function likePost(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const postId = Number(req.params.id);

    const [updated] = await db
      .update(postsTable)
      .set({ likes: sql`${postsTable.likes} + 1` })
      .where(eq(postsTable.id, postId))
      .returning({ likes: postsTable.likes });

    if (!updated) throw createError("Post not found", 404, "NOT_FOUND");

    res.json({ likes: updated.likes });
  } catch (err) {
    next(err);
  }
}

export async function listComments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const postId = Number(req.params.id);

    const comments = await db
      .select({
        id: commentsTable.id,
        content: commentsTable.content,
        createdAt: commentsTable.createdAt,
        author: {
          id: usersTable.id,
          username: usersTable.username,
          displayName: usersTable.displayName,
          avatarColor: usersTable.avatarColor,
          level: usersTable.level,
        },
      })
      .from(commentsTable)
      .leftJoin(usersTable, eq(commentsTable.userId, usersTable.id))
      .where(eq(commentsTable.postId, postId))
      .orderBy(desc(commentsTable.createdAt))
      .limit(20);

    res.json({ comments });
  } catch (err) {
    next(err);
  }
}

export async function addComment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const postId = Number(req.params.id);
    const { content } = req.body;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      throw createError("Content is required", 400, "VALIDATION_ERROR");
    }

    const [comment] = await db
      .insert(commentsTable)
      .values({ postId, userId, content: content.trim() })
      .returning();

    await db
      .update(postsTable)
      .set({ commentsCount: sql`${postsTable.commentsCount} + 1` })
      .where(eq(postsTable.id, postId));

    res.status(201).json({ comment });
  } catch (err) {
    next(err);
  }
}
