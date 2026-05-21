import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const gamerDNATable = pgTable("gamer_dna", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique().references(() => usersTable.id, { onDelete: "cascade" }),
  archetype: text("archetype").notNull().default("Explorer"),
  topGenre: text("top_genre").notNull().default("Mixed"),
  rarity: text("rarity").notNull().default("Common"),
  description: text("description").notNull().default(""),
  genreAffinityJson: text("genre_affinity_json").notNull().default("{}"),
  computedAt: timestamp("computed_at").defaultNow().notNull(),
});

export type GamerDNA = typeof gamerDNATable.$inferSelect;
