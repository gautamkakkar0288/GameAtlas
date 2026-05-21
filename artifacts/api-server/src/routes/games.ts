import { Router } from "express";
import { listGames, getGame, getTrending } from "../controllers/games.controller.js";

const router = Router();

router.get("/", listGames);
router.get("/trending", getTrending);
router.get("/:slug", getGame);

export default router;
