const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("passport");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({ origin: frontendOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

require("./config/passport");
app.use(passport.initialize());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Database connection
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
