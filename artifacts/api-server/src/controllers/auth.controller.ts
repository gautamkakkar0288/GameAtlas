import type { Request, Response, NextFunction } from "express-serve-static-core";
import bcrypt from "bcryptjs";
import { db, usersTable } from "../../../../lib/db/src/index.js";
import { eq } from "../../../../lib/db/src/index.js";
import { signToken } from "../lib/jwt.js";
import { registerSchema, loginSchema } from "../../../../lib/db/src/schema/index.js";
import { createError } from "../middleware/errorHandler.js";

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "VALIDATION_ERROR", issues: parsed.error.issues });
      return;
    }

    const { email, username, password, displayName } = parsed.data;

    const [existingEmail] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (existingEmail) {
      throw createError("Email already in use", 409, "EMAIL_TAKEN");
    }

    const [existingUsername] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1);

    if (existingUsername) {
      throw createError("Username already taken", 409, "USERNAME_TAKEN");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const avatarColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 45%)`;

    const [user] = await db
      .insert(usersTable)
      .values({
        email,
        username,
        passwordHash,
        displayName: displayName ?? username,
        avatarColor,
        level: 1,
        xp: 0,
        rankTier: "Bronze",
      })
      .returning({
        id: usersTable.id,
        email: usersTable.email,
        username: usersTable.username,
        displayName: usersTable.displayName,
        level: usersTable.level,
        xp: usersTable.xp,
        avatarColor: usersTable.avatarColor,
        rankTier: usersTable.rankTier,
        bio: usersTable.bio,
        favoriteGenre: usersTable.favoriteGenre,
        favoriteGame: usersTable.favoriteGame,
        createdAt: usersTable.createdAt,
      });

    const token = signToken({ userId: user.id, email: user.email, username: user.username });

    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "VALIDATION_ERROR", issues: parsed.error.issues });
      return;
    }

    const { email, password } = parsed.data;

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!user) {
      throw createError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw createError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    const token = signToken({ userId: user.id, email: user.email, username: user.username });

    const { passwordHash: _, ...publicUser } = user;
    res.json({ user: publicUser, token });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [user] = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        username: usersTable.username,
        displayName: usersTable.displayName,
        bio: usersTable.bio,
        level: usersTable.level,
        xp: usersTable.xp,
        avatarColor: usersTable.avatarColor,
        rankTier: usersTable.rankTier,
        favoriteGenre: usersTable.favoriteGenre,
        favoriteGame: usersTable.favoriteGame,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(eq(usersTable.id, req.user!.userId))
      .limit(1);

    if (!user) {
      throw createError("User not found", 404, "NOT_FOUND");
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export function logout(_req: Request, res: Response): void {
  res.json({ message: "Logged out successfully" });
}
