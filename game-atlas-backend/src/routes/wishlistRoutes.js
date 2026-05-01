const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const wishlistController = require("../controllers/wishlistController");

router.post("/add", authMiddleware, wishlistController.addToWishlist);

router.get("/", authMiddleware, wishlistController.getWishlist);

router.delete("/remove", authMiddleware, wishlistController.removeFromWishlist);

module.exports = router;
