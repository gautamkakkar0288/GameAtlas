import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getProfile, updateProfile, getUserAchievements, saveOnboarding, getOnboardingStatus } from "../controllers/users.controller.js";

const router = Router();

router.use(requireAuth);
router.get("/me", getProfile);
router.patch("/me", updateProfile);
router.get("/me/achievements", getUserAchievements);
router.post("/me/onboarding", saveOnboarding);
router.get("/me/onboarding", getOnboardingStatus);

export default router;
