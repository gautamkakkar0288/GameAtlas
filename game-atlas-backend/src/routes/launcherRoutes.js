const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const launcherController = require("../controllers/launcherController");

router.post("/launch", authMiddleware, launcherController.launchGame);

module.exports = router;