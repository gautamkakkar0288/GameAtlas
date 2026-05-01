const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const jwtSecret = process.env.JWT_SECRET;

  if (!authHeader) return res.status(401).json({ msg: "No token provided" });
  if (!jwtSecret) return res.status(500).json({ msg: "JWT secret is not configured" });

  try {
    const tokenParts = authHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res.status(401).json({ msg: "Invalid authorization header format" });
    }
    const actualToken = tokenParts[1];

    const decoded = jwt.verify(actualToken, jwtSecret);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};
