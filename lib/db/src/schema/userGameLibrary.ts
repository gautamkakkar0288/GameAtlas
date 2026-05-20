import { pgTable, serial, integer, real, text, boolean, timestamp, index, unique } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";
import { gamesTable } from "./games.js";

export const userGameLibraryTable = pgTable("user_game_library", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  gameId: integer("game_id").notNull().references(() => gamesTable.id, { onDelete: "cascade" }),
  playtime: real("playtime").default(0).notNull(),
  status: text("status").default("not_started").notNull(),
  favorite: boolean("favorite").default(false).notNull(),
  lastPlayed: timestamp("last_played"),
  addedAt: timestamp("added_at").defaultNow().notNull(),
}, (table) => [
  index("library_user_id_idx").on(table.userId),
  index("library_game_id_idx").on(table.gameId),
  index("library_status_idx").on(table.status),
  unique("library_user_game_unique").on(table.userId, table.gameId),
]);

export type UserGameLibrary = typeof userGameLibraryTable.$inferSelect;
export type InsertUserGameLibrary = typeof userGameLibraryTable.$inferInsert;
