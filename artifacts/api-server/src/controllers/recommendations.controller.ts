import type { Request, Response, NextFunction } from "express-serve-static-core";
import { db, gamesTable, userGameLibraryTable } from "../../../../lib/db/src/index.js";
import { eq } from "../../../../lib/db/src/index.js";
import { recommendationsService } from "../services/recommendations.service.js";

export async function getPersonalRecommendations(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const recommendations = await recommendationsService.getPersonalRecommendations(userId);
    res.json({ recommendations });
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
