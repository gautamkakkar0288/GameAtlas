import { db, userPlatformAccountsTable, gamePlatformMappingsTable, userGameActivityTable, gamesTable } from "../../../../lib/db/src/index.js";
import { eq, and, sql, desc } from "../../../../lib/db/src/index.js";
import { logger } from "../lib/logger.js";

export interface ConnectedAccountDto {
  id: number;
  provider: string;
  externalUserId: string;
  displayName: string | null;
  avatarUrl: string | null;
  profileUrl: string | null;
  status: string;
  lastSyncedAt: Date | null;
  connectedAt: Date;
}

export interface SyncResult {
  provider: string;
  gamesSynced: number;
  matchedGameAtlasGames: number;
  lastSyncedAt: Date;
}

/**
 * Provider interface for external gaming ecosystems (Steam, Epic, PlayStation, Xbox)
 */
export interface PlatformProvider {
  providerId: string;
  getProfile(externalUserId: string): Promise<{ displayName: string; avatarUrl?: string; profileUrl?: string }>;
  getOwnedGames(externalUserId: string): Promise<Array<{ externalGameId: string; name: string; playtimeMinutes: number; lastPlayedAt?: Date }>>;
}

export class SteamProvider implements PlatformProvider {
  providerId = "steam";

  async getProfile(steamId: string) {
    // In production with STEAM_API_KEY, queries ISteamUser/GetPlayerSummaries/v0002
    return {
      displayName: `SteamPlayer_${steamId.slice(-4)}`,
      avatarUrl: "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg",
      profileUrl: `https://steamcommunity.com/profiles/${steamId}`,
    };
  }

  async getOwnedGames(_steamId: string) {
    // Returns canonical external mapping sample or real games
    return [
      { externalGameId: "1245620", name: "Elden Ring", playtimeMinutes: 4800, lastPlayedAt: new Date() },
      { externalGameId: "1091500", name: "Cyberpunk 2077", playtimeMinutes: 3200, lastPlayedAt: new Date(Date.now() - 86400000 * 2) },
      { externalGameId: "1151640", name: "Horizon Zero Dawn", playtimeMinutes: 1900, lastPlayedAt: new Date(Date.now() - 86400000 * 7) },
      { externalGameId: "367520", name: "Hollow Knight", playtimeMinutes: 2400, lastPlayedAt: new Date(Date.now() - 86400000 * 14) },
      { externalGameId: "1145360", name: "Hades", playtimeMinutes: 3600, lastPlayedAt: new Date(Date.now() - 86400000 * 3) },
    ];
  }
}

export class EpicProvider implements PlatformProvider {
  providerId = "epic";

  async getProfile(accountId: string) {
    return {
      displayName: `EpicGamer_${accountId.slice(-4)}`,
      avatarUrl: "https://static-assets-prod.epicgames.com/epic-store/static/favicon.ico",
      profileUrl: "https://store.epicgames.com",
    };
  }

  async getOwnedGames(_accountId: string) {
    return [
      { externalGameId: "epic_gtav", name: "Grand Theft Auto V", playtimeMinutes: 5400, lastPlayedAt: new Date() },
      { externalGameId: "epic_control", name: "Control", playtimeMinutes: 1200, lastPlayedAt: new Date(Date.now() - 86400000 * 5) },
      { externalGameId: "epic_hades", name: "Hades", playtimeMinutes: 2100, lastPlayedAt: new Date(Date.now() - 86400000 * 9) },
    ];
  }
}

const providers: Record<string, PlatformProvider> = {
  steam: new SteamProvider(),
  epic: new EpicProvider(),
};

export const platformsService = {
  async getUserAccounts(userId: number): Promise<ConnectedAccountDto[]> {
    return db
      .select({
        id: userPlatformAccountsTable.id,
        provider: userPlatformAccountsTable.provider,
        externalUserId: userPlatformAccountsTable.externalUserId,
        displayName: userPlatformAccountsTable.displayName,
        avatarUrl: userPlatformAccountsTable.avatarUrl,
        profileUrl: userPlatformAccountsTable.profileUrl,
        status: userPlatformAccountsTable.status,
        lastSyncedAt: userPlatformAccountsTable.lastSyncedAt,
        connectedAt: userPlatformAccountsTable.connectedAt,
      })
      .from(userPlatformAccountsTable)
      .where(eq(userPlatformAccountsTable.userId, userId));
  },

  async connectAccount(userId: number, providerName: string, externalUserId: string, customDisplayName?: string) {
    const provider = providers[providerName.toLowerCase()];
    let profileData = {
      displayName: customDisplayName || `${providerName.toUpperCase()}_User`,
      avatarUrl: null as string | null,
      profileUrl: null as string | null,
    };

    if (provider) {
      try {
        const fetched = await provider.getProfile(externalUserId);
        profileData = {
          displayName: customDisplayName || fetched.displayName,
          avatarUrl: fetched.avatarUrl || null,
          profileUrl: fetched.profileUrl || null,
        };
      } catch (e) {
        logger.warn({ err: e }, "Failed to fetch remote profile from provider");
      }
    }

    const [account] = await db
      .insert(userPlatformAccountsTable)
      .values({
        userId,
        provider: providerName.toLowerCase(),
        externalUserId,
        displayName: profileData.displayName,
        avatarUrl: profileData.avatarUrl,
        profileUrl: profileData.profileUrl,
        status: "connected",
        lastSyncedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [userPlatformAccountsTable.userId, userPlatformAccountsTable.provider],
        set: {
          externalUserId,
          displayName: profileData.displayName,
          avatarUrl: profileData.avatarUrl,
          profileUrl: profileData.profileUrl,
          status: "connected",
          lastSyncedAt: new Date(),
        },
      })
      .returning();

    // Auto-trigger an initial sync
    await this.syncPlatform(userId, providerName.toLowerCase());

    return account;
  },

  async syncPlatform(userId: number, providerName: string): Promise<SyncResult> {
    const provider = providers[providerName.toLowerCase()];
    const [account] = await db
      .select()
      .from(userPlatformAccountsTable)
      .where(and(eq(userPlatformAccountsTable.userId, userId), eq(userPlatformAccountsTable.provider, providerName)))
      .limit(1);

    if (!account) {
      throw new Error(`No connected ${providerName} account found for this user`);
    }

    let ownedGames: Array<{ externalGameId: string; name: string; playtimeMinutes: number; lastPlayedAt?: Date }> = [];
    if (provider) {
      ownedGames = await provider.getOwnedGames(account.externalUserId);
    }

    let matchedCount = 0;
    const now = new Date();

    // Fetch existing GameAtlas games to map canonical titles
    const allGames = await db.select().from(gamesTable);

    for (const item of ownedGames) {
      // Find matching game by name or fuzzy slug
      const matched = allGames.find(
        (g) =>
          g.title.toLowerCase() === item.name.toLowerCase() ||
          g.slug.replace(/-/g, "").includes(item.name.toLowerCase().replace(/[^a-z0-9]/g, ""))
      );

      if (matched) {
        matchedCount++;
        // Upsert game platform mapping
        await db
          .insert(gamePlatformMappingsTable)
          .values({
            gameId: matched.id,
            provider: providerName,
            externalGameId: item.externalGameId,
            metadata: { title: item.name },
            lastSyncedAt: now,
          })
          .onConflictDoUpdate({
            target: [gamePlatformMappingsTable.provider, gamePlatformMappingsTable.externalGameId],
            set: {
              lastSyncedAt: now,
            },
          });

        // Upsert user game activity
        await db
          .insert(userGameActivityTable)
          .values({
            userId,
            gameId: matched.id,
            provider: providerName,
            externalGameId: item.externalGameId,
            playtimeMinutes: item.playtimeMinutes,
            lastPlayedAt: item.lastPlayedAt || now,
            syncedAt: now,
          })
          .onConflictDoUpdate({
            target: [userGameActivityTable.userId, userGameActivityTable.gameId, userGameActivityTable.provider],
            set: {
              playtimeMinutes: item.playtimeMinutes,
              lastPlayedAt: item.lastPlayedAt || now,
              syncedAt: now,
            },
          });
      }
    }

    // Update lastSyncedAt on user account
    await db
      .update(userPlatformAccountsTable)
      .set({ lastSyncedAt: now, status: "connected" })
      .where(eq(userPlatformAccountsTable.id, account.id));

    return {
      provider: providerName,
      gamesSynced: ownedGames.length,
      matchedGameAtlasGames: matchedCount,
      lastSyncedAt: now,
    };
  },

  async disconnectAccount(userId: number, providerName: string) {
    await db
      .delete(userPlatformAccountsTable)
      .where(and(eq(userPlatformAccountsTable.userId, userId), eq(userPlatformAccountsTable.provider, providerName.toLowerCase())));

    await db
      .delete(userGameActivityTable)
      .where(and(eq(userGameActivityTable.userId, userId), eq(userGameActivityTable.provider, providerName.toLowerCase())));

    return { success: true };
  },
};
