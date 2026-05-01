const express = require("express");

const router = express.Router();

const storeController = require("../controllers/storeController");

router.get("/redirect/:gameId", storeController.redirectToStore);

module.exports = router;