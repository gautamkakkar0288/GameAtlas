import { db, gamerDNATable, userGameActivityTable, userPreferencesTable, gamesTable } from "../../../../lib/db/src/index.js";
import { eq } from "../../../../lib/db/src/index.js";

export const dnaService = {
    async calculateDNA(userId: number) {
        // 1. Fetch signals
        const activity = await db.select().from(userGameActivityTable).where(eq(userGameActivityTable.userId, userId));
        const preferences = await db.select().from(userPreferencesTable).where(eq(userPreferencesTable.userId, userId)).limit(1);

        // 2. Calculate scores (simplified logic for now)
        const totalPlaytime = activity.reduce((sum, a) => sum + a.playtimeMinutes, 0);
        const gameCount = activity.length;

        const explorerScore = gameCount > 10 ? 80 : 40;
        const competitorScore = activity.some(a => a.playtimeMinutes > 1000) ? 70 : 30;

        const dimensions = {
            Explorer: explorerScore,
            Competitor: competitorScore,
            Completionist: 50,
            StorySeeker: 50,
        };

        const confidence = gameCount > 5 ? "high" : "low";

        // 3. Update DNA
        await db.insert(gamerDNATable).values({
            userId,
            archetype: "Explorer",
            topGenre: "RPG",
            rarity: "Common",
            description: "You love exploring new worlds.",
            dnaVersion: 1,
            confidence,
            dimensionsJson: dimensions,
            signalsJson: { totalPlaytime, gameCount },
            explanationJson: ["You have played many games.", "You seem to enjoy exploration."],
        }).onConflictDoUpdate({
            target: [gamerDNATable.userId],
            set: {
                archetype: "Explorer",
                dimensionsJson: dimensions,
                confidence,
                computedAt: new Date(),
            }
        });
    }
};
