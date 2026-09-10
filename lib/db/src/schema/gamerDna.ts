import { pgTable, serial, integer, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const gamerDNATable = pgTable("gamer_dna", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique().references(() => usersTable.id, { onDelete: "cascade" }),
  archetype: text("archetype").notNull().default("Explorer"),
  topGenre: text("top_genre").notNull().default("Mixed"),
  rarity: text("rarity").notNull().default("Common"),
  description: text("description").notNull().default(""),
  genreAffinityJson: text("genre_affinity_json").notNull().default("{}"),
  dnaVersion: integer("dna_version").notNull().default(1),
  confidence: text("confidence").notNull().default("low"), // 'low' | 'medium' | 'high'
  confidenceReason: text("confidence_reason").default("Initializing profile from onboarding priors."),
  dimensionsJson: jsonb("dimensions_json").$type<Record<string, number>>(),
  signalsJson: jsonb("signals_json").$type<Record<string, unknown>>(),
  explanationJson: jsonb("explanation_json").$type<string[]>(),
  computedAt: timestamp("computed_at").defaultNow().notNull(),
});

export type GamerDNA = typeof gamerDNATable.$inferSelect;
