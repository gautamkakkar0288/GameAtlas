import { db, userPlatformAccountsTable, gamePlatformMappingsTable, userGameActivityTable, gamesTable, unmatchedProviderGamesTable, syncHistoryTable } from "../../../../lib/db/src/index.js";
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
export type ProviderStatus =
  | "available"
  | "configuration_required"
  | "coming_soon"
  | "temporarily_unavailable"
  | "connected"
  | "error";

export interface PlatformCapabilities {
  identity: boolean;
  library: boolean;
  playtime: boolean;
  achievements: boolean;
  wishlist: boolean;
}

export interface PlatformProvider {
  providerId: string;
  status: ProviderStatus;
  capabilities: PlatformCapabilities;
  getProfile(externalUserId: string): Promise<{ displayName: string; avatarUrl?: string; profileUrl?: string }>;
  getOwnedGames(externalUserId: string): Promise<Array<{ externalGameId: string; name: string; playtimeMinutes: number; lastPlayedAt?: Date }>>;
}

export class SteamProvider implements PlatformProvider {
  providerId = "steam";
  status: ProviderStatus = process.env.STEAM_API_KEY ? "available" : "configuration_required";
  capabilities: PlatformCapabilities = { identity: true, library: true, playtime: true, achievements: true, wishlist: false };
  private apiKey = process.env.STEAM_API_KEY;

  async getProfile(steamId: string) {
    if (!this.apiKey) throw new Error("STEAM_API_KEY not configured");

    const response = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${this.apiKey}&steamids=${steamId}`);
    const data = (await response.json()) as any;
    const player = data.response.players[0];

    return {
      displayName: player.personaname,
      avatarUrl: player.avatarfull,
      profileUrl: player.profileurl,
    };
  }

  async getOwnedGames(steamId: string) {
    if (!this.apiKey) throw new Error("STEAM_API_KEY not configured");

    const response = await fetch(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${this.apiKey}&steamid=${steamId}&include_appinfo=true&format=json`);
    const data = (await response.json()) as any;

    return (data.response.games || []).map((game: any) => ({
      externalGameId: game.appid.toString(),
      name: game.name,
      playtimeMinutes: game.playtime_forever,
      lastPlayedAt: game.rtime_last_played ? new Date(game.rtime_last_played * 1000) : undefined,
    }));
  }
}

export class EpicProvider implements PlatformProvider {
  providerId = "epic";
  status: ProviderStatus = "configuration_required";
  capabilities: PlatformCapabilities = { identity: true, library: true, playtime: true, achievements: false, wishlist: false };

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

export class XboxProvider implements PlatformProvider {
  providerId = "xbox";
  status: ProviderStatus = "configuration_required";
  capabilities: PlatformCapabilities = { identity: true, library: true, playtime: true, achievements: true, wishlist: false };

  async getProfile(accountId: string) {
    return { displayName: "Xbox User" };
  }
  async getOwnedGames(accountId: string) {
    return [];
  }
}

export class PlayStationProvider implements PlatformProvider {
  providerId = "playstation";
  status: ProviderStatus = "coming_soon";
  capabilities: PlatformCapabilities = { identity: false, library: false, playtime: false, achievements: false, wishlist: false };

  async getProfile(accountId: string) {
    return { displayName: "PlayStation User" };
  }
  async getOwnedGames(accountId: string) {
    return [];
  }
}

const providers: Record<string, PlatformProvider> = {
  steam: new SteamProvider(),
  epic: new EpicProvider(),
  xbox: new XboxProvider(),
  playstation: new PlayStationProvider(),
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
    let unmatchedCount = 0;
    const now = new Date();

    // Record sync start
    const [syncRecord] = await db.insert(syncHistoryTable).values({
      userId,
      provider: providerName,
      status: "in_progress",
      startedAt: now,
    }).returning();

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
      } else {
        unmatchedCount++;
        // Record unmatched game
        await db
          .insert(unmatchedProviderGamesTable)
          .values({
            userId,
            provider: providerName,
            externalGameId: item.externalGameId,
            externalName: item.name,
            playtimeMinutes: item.playtimeMinutes,
            rawMetadata: { lastPlayedAt: item.lastPlayedAt },
          })
          .onConflictDoUpdate({
            target: [unmatchedProviderGamesTable.userId, unmatchedProviderGamesTable.provider, unmatchedProviderGamesTable.externalGameId],
            set: {
              playtimeMinutes: item.playtimeMinutes,
              updatedAt: now,
            },
          });
      }
    }

    // Update lastSyncedAt on user account
    await db
      .update(userPlatformAccountsTable)
      .set({ lastSyncedAt: now, status: "connected" })
      .where(eq(userPlatformAccountsTable.id, account.id));

    // Update sync record
    await db.update(syncHistoryTable).set({
      status: "success",
      gamesFound: ownedGames.length,
      gamesMatched: matchedCount,
      gamesUnmatched: unmatchedCount,
      completedAt: new Date(),
    }).where(eq(syncHistoryTable.id, syncRecord.id));

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
