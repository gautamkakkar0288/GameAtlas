import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { gamesTable } from "./games.js";
import { usersTable } from "./users.js";

export const achievementsTable = pgTable("achievements", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").notNull().references(() => gamesTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  rarity: text("rarity").notNull().default("Common"),
  iconUrl: text("icon_url"),
  xpReward: integer("xp_reward").default(50).notNull(),
  rarityPercent: text("rarity_percent").default("50.0"),
});

export const userAchievementsTable = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  achievementId: integer("achievement_id").notNull().references(() => achievementsTable.id, { onDelete: "cascade" }),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});

export type Achievement = typeof achievementsTable.$inferSelect;
export type UserAchievement = typeof userAchievementsTable.$inferSelect;
