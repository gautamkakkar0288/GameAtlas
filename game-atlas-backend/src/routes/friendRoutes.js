const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const friendController = require("../controllers/friendController");

router.post("/add", authMiddleware, friendController.sendFriendRequest);

router.post("/accept", authMiddleware, friendController.acceptFriendRequest);

router.get("/", authMiddleware, friendController.getFriends);

module.exports = router;