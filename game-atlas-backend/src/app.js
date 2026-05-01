const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();

const authMiddleware = require("./middleware/authMiddleware");

const gameRoutes = require("./routes/gameRoutes");
const libraryRoutes = require("./routes/libraryRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const launcherRoutes = require("./routes/launcherRoutes");
const playtimeRoutes = require("./routes/playtimeRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const friendRoutes = require("./routes/friendRoutes");
const achievementRoutes = require("./routes/achievementRoutes");
const storeRoutes = require("./routes/storeRoutes");


app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/launcher", launcherRoutes);
app.use("/api/playtime", playtimeRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/store", storeRoutes);
app.get("/", (req, res) => {
  res.send("Game Atlas API Running 🚀");
});

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed protected route",
    userId: req.user.userId
  });
});

module.exports = app;