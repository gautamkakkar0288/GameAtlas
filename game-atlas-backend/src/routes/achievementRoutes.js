const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const achievementController = require("../controllers/achievementController");

router.post("/add", achievementController.addAchievement);

router.post("/unlock", authMiddleware, achievementController.unlockAchievement);

router.get("/my", authMiddleware, achievementController.getUserAchievements);

module.exports = router;