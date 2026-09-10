import { db, gamesTable, userGameLibraryTable, gamerDNATable } from "../../../../lib/db/src/index.js";
import { eq, inArray } from "../../../../lib/db/src/index.js";

export const recommendationsService = {
    async getPersonalRecommendations(userId: number) {
        // 1. Fetch user DNA
        const [dna] = await db
            .select()
            .from(gamerDNATable)
            .where(eq(gamerDNATable.userId, userId))
            .limit(1);

        // 2. Fetch library
        const libraryEntries = await db
            .select({ gameId: userGameLibraryTable.gameId })
            .from(userGameLibraryTable)
            .where(eq(userGameLibraryTable.userId, userId));
        const libraryGameIds = new Set(libraryEntries.map((e) => e.gameId));

        // 3. Fetch all games
        const allGames = await db.select().from(gamesTable);
        const candidates = allGames.filter((g) => !libraryGameIds.has(g.id));

        // 4. Score games
        const scored = candidates.map((game) => {
            let score = game.rating * 2;

            // DNA-based boosting
            if (dna && dna.dimensionsJson) {
                const dimensions = dna.dimensionsJson as Record<string, number>;
                // Example: Boost games that match the top genre
                if (game.genre === dna.topGenre) {
                    score += 10;
                }
                // Example: Boost based on archetype dimensions (simplified)
                if (dimensions["Explorer"] && dimensions["Explorer"] > 70 && game.genre === "Open World") {
                    score += 5;
                }
            }

            return { ...game, _score: score };
        });

        return scored
            .sort((a, b) => b._score - a._score)
            .slice(0, 8)
            .map(({ _score: _s, ...game }) => game);
    },
};
