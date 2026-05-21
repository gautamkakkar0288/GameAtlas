import type { Request, Response, NextFunction } from "express-serve-static-core";
import { db, gamesTable, userGameLibraryTable } from "../../../../lib/db/src/index.js";
import { eq, inArray } from "../../../../lib/db/src/index.js";

export async function getPersonalRecommendations(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;

    const libraryEntries = await db
      .select({ gameId: userGameLibraryTable.gameId })
      .from(userGameLibraryTable)
      .where(eq(userGameLibraryTable.userId, userId));

    const libraryGameIds = libraryEntries.map((e) => e.gameId);
    const genreFrequency: Record<string, number> = {};

    if (libraryGameIds.length > 0) {
      const libraryGames = await db
        .select({ genre: gamesTable.genre })
        .from(gamesTable)
        .where(inArray(gamesTable.id, libraryGameIds));
      for (const g of libraryGames) {
        genreFrequency[g.genre] = (genreFrequency[g.genre] ?? 0) + 1;
      }
    }

    const allGames = await db.select().from(gamesTable);
    const librarySet = new Set(libraryGameIds);
    const candidates = allGames.filter((g) => !librarySet.has(g.id));

    const scored = candidates
      .map((game) => {
        let score = game.rating * 2;
        score += (genreFrequency[game.genre] ?? 0) * 3;
        return { ...game, _score: score };
      })
      .sort((a, b) => b._score - a._score)
      .map(({ _score: _s, ...game }) => game);

    res.json({ recommendations: scored.slice(0, 8) });
  } catch (err) {
    next(err);
  }
}

export async function getSimilarGames(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const slug = String(req.params["slug"]);
    const [game] = await db.select().from(gamesTable).where(eq(gamesTable.slug, slug)).limit(1);

    if (!game) {
      res.json({ similar: [] });
      return;
    }

    const allGames = await db.select().from(gamesTable);
    const similar = allGames
      .filter((g) => g.id !== game.id)
      .map((g) => {
        let score = g.rating * 1.5;
        if (g.genre === game.genre) score += 5;
        if (g.platform === game.platform) score += 2;
        return { ...g, _score: score };
      })
      .sort((a, b) => b._score - a._score)
      .slice(0, 6)
      .map(({ _score: _s, ...g }) => g);

    res.json({ similar });
  } catch (err) {
    next(err);
  }
}

export async function getBecauseYouPlayed(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;

    const library = await db
      .select({ gameId: userGameLibraryTable.gameId, playtime: userGameLibraryTable.playtime })
      .from(userGameLibraryTable)
      .where(eq(userGameLibraryTable.userId, userId))
      .orderBy(userGameLibraryTable.playtime);

    if (library.length === 0) {
      res.json({ game: null, recommendations: [] });
      return;
    }

    const topEntry = library[library.length - 1]!;
    const [topGame] = await db.select().from(gamesTable).where(eq(gamesTable.id, topEntry.gameId)).limit(1);

    if (!topGame) {
      res.json({ game: null, recommendations: [] });
      return;
    }

    const librarySet = new Set(library.map((e) => e.gameId));
    const allGames = await db.select().from(gamesTable);
    const recs = allGames
      .filter((g) => !librarySet.has(g.id))
      .map((g) => {
        let score = g.rating * 1.5;
        if (g.genre === topGame.genre) score += 6;
        if (g.platform === topGame.platform) score += 2;
        return { ...g, _score: score };
      })
      .sort((a, b) => b._score - a._score)
      .slice(0, 6)
      .map(({ _score: _s, ...g }) => g);

    res.json({ game: topGame, recommendations: recs });
  } catch (err) {
    next(err);
  }
}
