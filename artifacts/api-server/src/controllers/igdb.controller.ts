import type { Request, Response, NextFunction } from "express-serve-static-core";
import {
  getTrendingGames,
  getUpcomingGames,
  getTopRatedGames,
  getGamesByGenre,
  searchGames,
  getGameBySlug,
  getAllGenres,
  igdbImageUrl,
  type IGDBGame,
} from "../services/igdb.service.js";

function normalizeGame(g: IGDBGame) {
  return {
    id: g.id,
    name: g.name,
    slug: g.slug,
    summary: g.summary ?? null,
    rating: g.rating ? Math.round(g.rating * 10) / 10 : null,
    ratingCount: g.rating_count ?? null,
    hypes: g.hypes ?? null,
    follows: g.follows ?? null,
    firstReleaseDate: g.first_release_date
      ? new Date(g.first_release_date * 1000).toISOString()
      : null,
    cover: igdbImageUrl(g.cover?.url, "t_cover_big"),
    coverThumb: igdbImageUrl(g.cover?.url, "t_thumb"),
    artwork: g.artworks?.[0] ? igdbImageUrl(g.artworks[0].url, "t_1080p") : null,
    screenshots: (g.screenshots ?? []).map((s) => ({
      id: s.id,
      url: igdbImageUrl(s.url, "t_screenshot_big"),
      fullUrl: igdbImageUrl(s.url, "t_1080p"),
    })),
    videos: (g.videos ?? []).map((v) => ({
      id: v.id,
      videoId: v.video_id,
      name: v.name,
      thumbnailUrl: `https://img.youtube.com/vi/${v.video_id}/hqdefault.jpg`,
    })),
    genres: (g.genres ?? []).map((genre) => genre.name),
    platforms: (g.platforms ?? []).map((p) => p.name),
    developer:
      g.involved_companies?.find((c) => c.developer)?.company.name ?? null,
    publisher:
      g.involved_companies?.find((c) => c.publisher)?.company.name ?? null,
    similarGames: (g.similar_games ?? []).slice(0, 6).map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      cover: igdbImageUrl(s.cover?.url, "t_cover_big"),
      rating: s.rating ? Math.round(s.rating * 10) / 10 : null,
    })),
  };
}

export async function trending(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const limit = Math.min(Number(req.query["limit"] ?? 12), 20);
    const games = await getTrendingGames(limit);
    res.json({ games: games.map(normalizeGame) });
  } catch (err) {
    next(err);
  }
}

export async function upcoming(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const limit = Math.min(Number(req.query["limit"] ?? 12), 20);
    const games = await getUpcomingGames(limit);
    res.json({ games: games.map(normalizeGame) });
  } catch (err) {
    next(err);
  }
}

export async function topRated(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const limit = Math.min(Number(req.query["limit"] ?? 12), 20);
    const games = await getTopRatedGames(limit);
    res.json({ games: games.map(normalizeGame) });
  } catch (err) {
    next(err);
  }
}

export async function byGenre(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const genreId = Number(req.params["genreId"]);
    const limit = Math.min(Number(req.query["limit"] ?? 12), 20);
    if (!genreId || isNaN(genreId)) {
      res.status(400).json({ error: "Invalid genreId" });
      return;
    }
    const games = await getGamesByGenre(genreId, limit);
    res.json({ games: games.map(normalizeGame) });
  } catch (err) {
    next(err);
  }
}

export async function search(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const q = String(req.query["q"] ?? "").trim();
    const limit = Math.min(Number(req.query["limit"] ?? 20), 30);
    if (!q) {
      res.json({ games: [] });
      return;
    }
    const games = await searchGames(q, limit);
    res.json({ games: games.map(normalizeGame) });
  } catch (err) {
    next(err);
  }
}

export async function gameBySlug(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const slug = String(req.params["slug"]);
    const game = await getGameBySlug(slug);
    if (!game) {
      res.status(404).json({ error: "Game not found on IGDB" });
      return;
    }
    res.json({ game: normalizeGame(game) });
  } catch (err) {
    next(err);
  }
}

export async function genres(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const list = await getAllGenres();
    res.json({ genres: list });
  } catch (err) {
    next(err);
  }
}
