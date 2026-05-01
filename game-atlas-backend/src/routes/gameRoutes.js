const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");
const authMiddleware = require("../middleware/authMiddleware");


router.get("/trending", gameController.getTrendingGames);
router.get("/search", gameController.searchGames);
router.post("/", authMiddleware, gameController.addGame);
router.get("/", gameController.getAllGames);
router.get("/:id", gameController.getGameById);

module.exports = router;