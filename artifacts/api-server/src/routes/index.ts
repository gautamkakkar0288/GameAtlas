import { Router } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import gamesRouter from "./games.js";
import libraryRouter from "./library.js";
import usersRouter from "./users.js";
import reviewsRouter from "./reviews.js";
import notificationsRouter from "./notifications.js";
import communityRouter from "./community.js";
import leaderboardsRouter from "./leaderboards.js";
import recommendationsRouter from "./recommendations.js";
import dnaRouter from "./dna.js";
import igdbRouter from "./igdb.js";
import platformsRouter from "./platforms.js";

const router = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/games", gamesRouter);
router.use("/library", libraryRouter);
router.use("/users", usersRouter);
router.use("/reviews", reviewsRouter);
router.use("/notifications", notificationsRouter);
router.use("/community", communityRouter);
router.use("/leaderboards", leaderboardsRouter);
router.use("/recommendations", recommendationsRouter);
router.use("/dna", dnaRouter);
router.use("/igdb", igdbRouter);
router.use("/platforms", platformsRouter);

export default router;
