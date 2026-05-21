import { pgTable, serial, integer, real, text, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";
import { gamesTable } from "./games.js";
import { z } from "zod/v4";

export const reviewsTable = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  gameId: integer("game_id").notNull().references(() => gamesTable.id, { onDelete: "cascade" }),
  rating: real("rating").notNull(),
  title: text("title").notNull(),
  reviewText: text("review_text").notNull(),
  pros: text("pros").array(),
  cons: text("cons").array(),
  recommended: boolean("recommended").default(true).notNull(),
  playtimeBefore: real("playtime_before").default(0),
  likes: integer("likes").default(0).notNull(),
  helpful: integer("helpful").default(0).notNull(),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("reviews_game_id_idx").on(table.gameId),
  index("reviews_user_id_idx").on(table.userId),
  index("reviews_rating_idx").on(table.rating),
  index("reviews_created_at_idx").on(table.createdAt),
]);

export const insertReviewSchema = z.object({
  gameId: z.number().int().positive(),
  rating: z.number().min(0.5).max(5),
  title: z.string().min(5).max(100),
  reviewText: z.string().min(20).max(5000),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
  recommended: z.boolean().optional(),
  playtimeBefore: z.number().optional(),
});

export type Review = typeof reviewsTable.$inferSelect;
export type InsertReview = typeof reviewsTable.$inferInsert;
