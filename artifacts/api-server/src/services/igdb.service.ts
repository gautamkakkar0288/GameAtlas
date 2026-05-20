import { logger } from "../lib/logger.js";

const IGDB_BASE = "https://api.igdb.com/v4";
const TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const REQUEST_TIMEOUT_MS = 8_000;

interface TokenCache {
  token: string;
  expiresAt: number;
}

interface ResponseCacheEntry {
  data: unknown;
  expiresAt: number;
}

interface FetchResponse {
  ok: boolean;
  status: number;
  text(): Promise<string>;
  json(): Promise<unknown>;
}

let tokenCache: TokenCache | null = null;
const responseCache = new Map<string, ResponseCacheEntry>();

async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt - 60_000) {
    return tokenCache.token;
  }

  const clientId = process.env["TWITCH_CLIENT_ID"];
  const clientSecret = process.env["TWITCH_CLIENT_SECRET"];

  if (!clientId || !clientSecret) {
    throw new Error("TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET must be set");
  }

  const url = `${TWITCH_TOKEN_URL}?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = (await fetch(url, {
      method: "POST",
      signal: controller.signal,
    })) as unknown as FetchResponse;
    if (!res.ok) {
      throw new Error(`Twitch token error: ${res.status} ${await res.text()}`);
    }
    const data = (await res.json()) as { access_token: string; expires_in: number };
    tokenCache = {
      token: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };
    logger.info("IGDB access token refreshed");
    return tokenCache.token;
  } finally {
    clearTimeout(timeout);
  }
}

async function cachedQuery<T>(
  cacheKey: string,
  ttlMs: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const cached = responseCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data as T;
  }

  const data = await fetcher();

  if (Array.isArray(data) && data.length === 0) {
    return data;
  }

  responseCache.set(cacheKey, { data, expiresAt: Date.now() + ttlMs });
  return data;
}

async function igdbQuery<T>(endpoint: string, body: string): Promise<T> {
  const token = await getAccessToken();
  const clientId = process.env["TWITCH_CLIENT_ID"]!;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = (await fetch(`${IGDB_BASE}/${endpoint}`, {
      method: "POST",
      headers: {
        "Client-ID": clientId,
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
      body,
      signal: controller.signal,
    })) as unknown as FetchResponse;

    if (res.status === 401) {
      tokenCache = null;
      throw new Error("IGDB token expired, will refresh on next request");
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`IGDB ${endpoint} error: ${res.status} — ${text}`);
    }

    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timeout);
  }
}

export function igdbImageUrl(
  url: string | undefined,
  size: "t_cover_big" | "t_1080p" | "t_screenshot_big" | "t_thumb" | "t_original" = "t_cover_big",
): string | null {
  if (!url) return null;
  const clean = url.startsWith("//") ? `https:${url}` : url;
  return clean.replace(/t_[a-z_]+/, size);
}

export interface IGDBGame {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  cover?: { url: string };
  artworks?: Array<{ url: string }>;
  screenshots?: Array<{ id: number; url: string }>;
  videos?: Array<{ id: number; video_id: string; name: string }>;
  genres?: Array<{ id: number; name: string }>;
  platforms?: Array<{ id: number; name: string }>;
  first_release_date?: number;
  rating?: number;
  rating_count?: number;
  involved_companies?: Array<{
    company: { name: string };
    developer: boolean;
    publisher: boolean;
  }>;
  similar_games?: Array<{
    id: number;
    name: string;
    slug: string;
    cover?: { url: string };
    rating?: number;
  }>;
  age_ratings?: Array<{ category: number; rating: number }>;
  hypes?: number;
  follows?: number;
}

const GAME_FIELDS = `
  fields id, name, slug, summary, rating, rating_count, hypes, follows,
    first_release_date,
    cover.url,
    artworks.url,
    screenshots.url, screenshots.id,
    videos.video_id, videos.name,
    genres.name, genres.id,
    platforms.name, platforms.id,
    involved_companies.company.name, involved_companies.developer, involved_companies.publisher,
    similar_games.id, similar_games.name, similar_games.slug, similar_games.cover.url, similar_games.rating,
    age_ratings.category, age_ratings.rating;
`.trim();

const TTL_5MIN = 5 * 60_000;
const TTL_15MIN = 15 * 60_000;
const TTL_1HOUR = 60 * 60_000;

async function safeIgdbQuery<T>(
  cacheKey: string,
  ttlMs: number,
  endpoint: string,
  body: string,
  fallback: T,
): Promise<T> {
  try {
    return await cachedQuery<T>(cacheKey, ttlMs, () => igdbQuery<T>(endpoint, body));
  } catch (err) {
    logger.warn({ err, cacheKey }, "IGDB query failed, returning fallback");
    return fallback;
  }
}

export async function getTrendingGames(limit = 12): Promise<IGDBGame[]> {
  return safeIgdbQuery(
    `trending:${limit}`,
    TTL_15MIN,
    "games",
    `${GAME_FIELDS}
where rating_count > 50 & cover != null & rating != null;
sort rating_count desc;
limit ${limit};`,
    [],
  );
}

export async function getUpcomingGames(limit = 12): Promise<IGDBGame[]> {
  const now = Math.floor(Date.now() / 1000);
  return safeIgdbQuery(
    `upcoming:${limit}`,
    TTL_1HOUR,
    "games",
    `${GAME_FIELDS}
where first_release_date > ${now} & cover != null & hypes != null;
sort hypes desc;
limit ${limit};`,
    [],
  );
}

export async function getTopRatedGames(limit = 12): Promise<IGDBGame[]> {
  return safeIgdbQuery(
    `top-rated:${limit}`,
    TTL_1HOUR,
    "games",
    `${GAME_FIELDS}
where rating_count > 200 & cover != null & rating != null;
sort rating desc;
limit ${limit};`,
    [],
  );
}

export async function getGamesByGenre(genreId: number, limit = 12): Promise<IGDBGame[]> {
  return safeIgdbQuery(
    `genre:${genreId}:${limit}`,
    TTL_1HOUR,
    "games",
    `${GAME_FIELDS}
where genres = (${genreId}) & rating_count > 50 & cover != null & rating != null;
sort rating desc;
limit ${limit};`,
    [],
  );
}

export async function searchGames(query: string, limit = 20): Promise<IGDBGame[]> {
  const escaped = query.replace(/"/g, "").slice(0, 100);
  return safeIgdbQuery(
    `search:${escaped}:${limit}`,
    TTL_5MIN,
    "games",
    `${GAME_FIELDS}
search "${escaped}";
where cover != null;
limit ${limit};`,
    [],
  );
}

export async function getGameBySlug(slug: string): Promise<IGDBGame | null> {
  const sanitized = slug.replace(/[^a-z0-9-]/g, "").slice(0, 100);
  const results = await safeIgdbQuery<IGDBGame[]>(
    `slug:${sanitized}`,
    TTL_1HOUR,
    "games",
    `${GAME_FIELDS}
where slug = "${sanitized}";
limit 1;`,
    [],
  );
  return results[0] ?? null;
}

export async function getGameScreenshots(gameId: number): Promise<Array<{ id: number; url: string }>> {
  return safeIgdbQuery(
    `screenshots:${gameId}`,
    TTL_1HOUR,
    "screenshots",
    `fields id, url;
where game = ${gameId};
limit 10;`,
    [],
  );
}

export interface IGDBGenre {
  id: number;
  name: string;
  slug: string;
}

export async function getAllGenres(): Promise<IGDBGenre[]> {
  return safeIgdbQuery(
    "genres",
    TTL_1HOUR,
    "genres",
    `fields id, name, slug;
limit 30;`,
    [],
  );
}
