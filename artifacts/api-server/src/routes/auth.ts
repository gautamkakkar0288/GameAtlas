import { Router } from "express";
import { register, login, me, logout, googleAuth } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/me", requireAuth, me);
router.post("/logout", requireAuth, logout);

export default router;
