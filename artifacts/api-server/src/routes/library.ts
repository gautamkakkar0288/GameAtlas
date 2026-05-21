import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getUserLibrary,
  addToLibrary,
  updateLibraryEntry,
  removeFromLibrary,
} from "../controllers/library.controller.js";

const router = Router();

router.use(requireAuth);
router.get("/", getUserLibrary);
router.post("/", addToLibrary);
router.patch("/:gameId", updateLibraryEntry);
router.delete("/:gameId", removeFromLibrary);

export default router;
