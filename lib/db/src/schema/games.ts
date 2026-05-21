import { pgTable, text, serial, real, integer, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const gamesTable = pgTable("games", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  coverImage: text("cover_image").notNull(),
  bannerImage: text("banner_image"),
  genre: text("genre").notNull(),
  platform: text("platform").notNull(),
  developer: text("developer").notNull(),
  publisher: text("publisher"),
  releaseYear: integer("release_year").notNull(),
  rating: real("rating").default(0).notNull(),
  size: real("size").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("games_genre_idx").on(table.genre),
  index("games_platform_idx").on(table.platform),
  index("games_rating_idx").on(table.rating),
  index("games_release_year_idx").on(table.releaseYear),
]);

export const insertGameSchema = createInsertSchema(gamesTable).omit({
  id: true,
  createdAt: true,
});

export const updateGameSchema = insertGameSchema.partial();

export type Game = typeof gamesTable.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;
