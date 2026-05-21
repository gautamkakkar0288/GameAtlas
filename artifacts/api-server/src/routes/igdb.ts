import { Router } from "express";
import {
  trending,
  upcoming,
  topRated,
  byGenre,
  search,
  gameBySlug,
  genres,
} from "../controllers/igdb.controller.js";

const router = Router();

router.get("/trending", trending);
router.get("/upcoming", upcoming);
router.get("/top-rated", topRated);
router.get("/genre/:genreId", byGenre);
router.get("/search", search);
router.get("/genres", genres);
router.get("/game/:slug", gameBySlug);

export default router;
