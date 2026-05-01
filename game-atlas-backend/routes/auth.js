const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
const isValidEmail = (email) =>
  typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  profilePic: user.profilePic,
  googleId: user.googleId
});

const signToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

router.post("/signup", upload.single("profilePic"), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const trimmedName = typeof name === "string" ? name.trim() : "";

    if (!trimmedName || !isValidEmail(normalizedEmail) || typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ msg: "Invalid signup data. Use a valid email and password with at least 8 characters." });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ msg: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
      profilePic: req.file ? req.file.path : null
    });
    const token = signToken({ userId: user._id });
    res.status(201).json({ user: sanitizeUser(user), token });
  } catch (err) {
    if (err.name === "MulterError") {
      return res.status(400).json({ msg: err.message });
    }
    if (err.message && err.message.includes("Only JPG, PNG, and WEBP")) {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!isValidEmail(normalizedEmail) || typeof password !== "string" || password.length === 0) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) return res.status(400).json({ msg: "User not found" });
    
    // Fallback in case of Google-created accounts without password
    if(!user.password) return res.status(400).json({ msg: "Invalid credentials. Try logging in with Google." });
    
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = signToken({ userId: user._id });
    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Google Routes
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/login` }),
  (req, res) => {
    const token = signToken({ userId: req.user._id });
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/login?token=${token}`);
  }
);

module.exports = router;
