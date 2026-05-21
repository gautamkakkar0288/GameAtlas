import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { pinoHttp } from "pino-http";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { generalLimiter, authLimiter, igdbLimiter } from "./middleware/rateLimiter.js";

const app = express();

app.set("trust proxy", 1);

function normalizeOrigin(origin: string | undefined): string | null {
  if (!origin) return null;
  const trimmed = origin.trim().replace(/\/$/, "");
  if (!trimmed) return null;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function getAllowedOrigins(): string[] {
  return [
    ...(process.env["ALLOWED_ORIGINS"] ?? "").split(","),
    process.env["VERCEL_URL"],
    process.env["VERCEL_PROJECT_PRODUCTION_URL"],
  ].flatMap((origin) => {
    const normalized = normalizeOrigin(origin);
    return normalized ? [normalized] : [];
  });
}

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  }),
);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: { id?: unknown; method?: string; url?: string }) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: { statusCode?: number }) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

const isDev = process.env["NODE_ENV"] !== "production";

app.use(
  cors({
    origin: isDev
      ? true
      : (origin, callback) => {
          const allowed = getAllowedOrigins();
          const normalizedOrigin = normalizeOrigin(origin);

          if (!normalizedOrigin || allowed.length === 0 || allowed.includes(normalizedOrigin)) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

app.use(cookieParser());
app.use(express.json({ limit: "256kb" }));
app.use(express.urlencoded({ extended: true, limit: "256kb" }));

app.use("/api", generalLimiter);
app.use("/api/auth", authLimiter);
app.use("/api/igdb", igdbLimiter);

app.use("/api", router);

app.use(errorHandler);

const swaggerDocument = YAML.load(path.join(process.cwd(), "lib/api-spec/openapi.yaml"));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
