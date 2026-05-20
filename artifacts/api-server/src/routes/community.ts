import { Router } from "express";
import { requireAuth, optionalAuth } from "../middleware/auth.js";
import { listPosts, createPost, likePost, listComments, addComment } from "../controllers/community.controller.js";

const router = Router();

router.get("/posts", optionalAuth, listPosts);
router.post("/posts", requireAuth, createPost);
router.post("/posts/:id/like", optionalAuth, likePost);
router.get("/posts/:id/comments", listComments);
router.post("/posts/:id/comments", requireAuth, addComment);

export default router;
