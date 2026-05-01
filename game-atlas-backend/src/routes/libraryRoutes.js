const express = require("express");
const router = express.Router();
const libraryController = require("../controllers/libraryController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, libraryController.addToLibrary);
router.get("/my", authMiddleware, libraryController.getMyLibrary);
router.post("/install", authMiddleware, libraryController.installGame);
router.post("/uninstall", authMiddleware, libraryController.uninstallGame);

module.exports = router;