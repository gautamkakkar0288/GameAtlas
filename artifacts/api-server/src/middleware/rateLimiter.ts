import rateLimit from "express-rate-limit";

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "TOO_MANY_REQUESTS", message: "Too many requests, please try again later." },
  skip: (req) => req.method === "OPTIONS",
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "TOO_MANY_REQUESTS", message: "Too many login attempts, please try again in 15 minutes." },
  skipSuccessfulRequests: true,
});

export const igdbLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "TOO_MANY_REQUESTS", message: "Too many external data requests, please slow down." },
});
