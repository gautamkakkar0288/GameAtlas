import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getGamerDNA } from "../controllers/dna.controller.js";

const router = Router();

router.use(requireAuth);
router.get("/", getGamerDNA);

export default router;
