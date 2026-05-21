import type { Request, Response, NextFunction } from "express-serve-static-core";
import { logger } from "../lib/logger.js";

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = err.statusCode ?? 500;
  const message = err.message ?? "Internal server error";

  if (statusCode >= 500) {
    logger.error({ err }, "Unhandled server error");
  }

  res.status(statusCode).json({
    error: err.code ?? "INTERNAL_ERROR",
    message,
    ...(process.env.NODE_ENV !== "production" && statusCode >= 500
      ? { stack: err.stack }
      : {}),
  });
}

export function createError(message: string, statusCode: number, code?: string): ApiError {
  const err = new Error(message) as ApiError;
  err.statusCode = statusCode;
  err.code = code;
  return err;
}
