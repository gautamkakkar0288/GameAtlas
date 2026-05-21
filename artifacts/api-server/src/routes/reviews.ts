import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { listReviews, getFeaturedReview, createReview, likeReview } from "../controllers/reviews.controller.js";

const router = Router();

router.get("/", listReviews);
router.get("/featured", getFeaturedReview);
router.post("/", requireAuth, createReview);
router.post("/:id/like", likeReview);

export default router;
