import { pgTable, text, serial, integer, real, timestamp, index, unique, jsonb } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";
import { gamesTable } from "./games.js";

export const userPlatformAccountsTable = pgTable(
  "user_platform_accounts",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(), // 'steam' | 'epic' | 'xbox' | 'playstation'
    externalUserId: text("external_user_id").notNull(),
    displayName: text("display_name"),
    avatarUrl: text("avatar_url"),
    profileUrl: text("profile_url"),
    status: text("status").default("connected").notNull(), // 'connected' | 'disconnected' | 'sync_error'
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    lastSyncedAt: timestamp("last_synced_at"),
    connectedAt: timestamp("connected_at").defaultNow().notNull(),
  },
  (table) => [
    index("platform_accounts_user_idx").on(table.userId),
    index("platform_accounts_provider_idx").on(table.provider),
    unique("platform_user_provider_unique").on(table.userId, table.provider),
  ]
);

export const gamePlatformMappingsTable = pgTable(
  "game_platform_mappings",
  {
    id: serial("id").primaryKey(),
    gameId: integer("game_id")
      .notNull()
      .references(() => gamesTable.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(),
    externalGameId: text("external_game_id").notNull(),
    externalUrl: text("external_url"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    lastSyncedAt: timestamp("last_synced_at").defaultNow().notNull(),
  },
  (table) => [
    index("game_mappings_game_idx").on(table.gameId),
    index("game_mappings_provider_idx").on(table.provider),
    unique("game_provider_external_id_unique").on(table.provider, table.externalGameId),
  ]
);

export const userGameActivityTable = pgTable(
  "user_game_activity",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    gameId: integer("game_id")
      .notNull()
      .references(() => gamesTable.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(),
    externalGameId: text("external_game_id").notNull(),
    playtimeMinutes: integer("playtime_minutes").default(0).notNull(),
    achievementsUnlocked: integer("achievements_unlocked").default(0).notNull(),
    totalAchievements: integer("total_achievements").default(0).notNull(),
    lastPlayedAt: timestamp("last_played_at"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    syncedAt: timestamp("synced_at").defaultNow().notNull(),
  },
  (table) => [
    index("activity_user_idx").on(table.userId),
    index("activity_game_idx").on(table.gameId),
    unique("user_game_provider_activity_unique").on(table.userId, table.gameId, table.provider),
  ]
);

export type UserPlatformAccount = typeof userPlatformAccountsTable.$inferSelect;
export type GamePlatformMapping = typeof gamePlatformMappingsTable.$inferSelect;
export type UserGameActivity = typeof userGameActivityTable.$inferSelect;
