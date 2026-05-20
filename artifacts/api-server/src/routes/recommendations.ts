import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getPersonalRecommendations,
  getSimilarGames,
  getBecauseYouPlayed,
} from "../controllers/recommendations.controller.js";

const router = Router();

router.get("/similar/:slug", getSimilarGames);
router.use(requireAuth);
router.get("/", getPersonalRecommendations);
router.get("/because-played", getBecauseYouPlayed);

export default router;
