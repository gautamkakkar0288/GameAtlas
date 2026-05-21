import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const userPreferencesTable = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique().references(() => usersTable.id, { onDelete: "cascade" }),
  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
  favoriteGenres: text("favorite_genres").array(),
  playStyle: text("play_style").default("casual"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type UserPreferences = typeof userPreferencesTable.$inferSelect;
export type InsertUserPreferences = typeof userPreferencesTable.$inferInsert;
