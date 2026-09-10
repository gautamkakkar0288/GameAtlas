import type { Request, Response, NextFunction } from "express-serve-static-core";
import { platformsService } from "../services/platforms.service.js";
import { createError } from "../middleware/errorHandler.js";

export async function getConnectedAccounts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const accounts = await platformsService.getUserAccounts(userId);
    res.json({ accounts });
  } catch (err) {
    next(err);
  }
}

export async function connectPlatform(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { provider, externalUserId, displayName } = req.body ?? {};

    if (!provider || typeof provider !== "string") {
      throw createError("Platform provider is required (e.g. steam, epic, xbox, playstation)", 400, "INVALID_PROVIDER");
    }

    if (!externalUserId || typeof externalUserId !== "string") {
      throw createError("External account ID or username is required", 400, "INVALID_EXTERNAL_ID");
    }

    const account = await platformsService.connectAccount(userId, provider, externalUserId, displayName);
    res.status(201).json({ account });
  } catch (err) {
    next(err);
  }
}

export async function syncPlatform(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const provider = String(req.params["provider"]);

    if (!provider) {
      throw createError("Provider parameter is required", 400, "MISSING_PROVIDER");
    }

    const result = await platformsService.syncPlatform(userId, provider);
    res.json({ result });
  } catch (err) {
    next(err);
  }
}

export async function disconnectPlatform(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const provider = String(req.params["provider"]);

    if (!provider) {
      throw createError("Provider parameter is required", 400, "MISSING_PROVIDER");
    }

    await platformsService.disconnectAccount(userId, provider);
    res.json({ message: `${provider} disconnected successfully` });
  } catch (err) {
    next(err);
  }
}
