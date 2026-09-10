import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getConnectedAccounts,
  connectPlatform,
  syncPlatform,
  disconnectPlatform,
} from "../controllers/platforms.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/accounts", getConnectedAccounts);
router.post("/connect", connectPlatform);
router.post("/sync/:provider", syncPlatform);
router.delete("/disconnect/:provider", disconnectPlatform);

export default router;
