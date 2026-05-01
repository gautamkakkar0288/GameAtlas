const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const playtimeController = require("../controllers/playtimeController");

router.post("/update", authMiddleware, playtimeController.updatePlaytime);

module.exports = router;
