const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const reviewController = require("../controllers/reviewController");

router.post("/add", authMiddleware, reviewController.addReview);

router.get("/game/:gameId", reviewController.getGameReviews);

router.get("/average/:gameId", reviewController.getAverageRating);

module.exports = router;