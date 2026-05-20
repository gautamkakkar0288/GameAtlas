import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";
import { z } from "zod/v4";

export const postsTable = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  type: text("type").notNull().default("text"),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  gameTag: text("game_tag"),
  likes: integer("likes").default(0).notNull(),
  commentsCount: integer("comments_count").default(0).notNull(),
  shares: integer("shares").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const commentsTable = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => postsTable.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPostSchema = z.object({
  type: z.enum(["text", "screenshot", "clip", "achievement", "recommendation"]),
  content: z.string().min(1).max(2000),
  imageUrl: z.string().url().optional(),
  gameTag: z.string().max(100).optional(),
});

export type Post = typeof postsTable.$inferSelect;
export type Comment = typeof commentsTable.$inferSelect;
