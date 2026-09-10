import type { Request, Response as ExpressResponse, NextFunction } from "express-serve-static-core";
import bcrypt from "bcryptjs";
import { db, usersTable, userIdentitiesTable } from "../../../../lib/db/src/index.js";
import { eq, and } from "../../../../lib/db/src/index.js";
import { signToken } from "../lib/jwt.js";
import { registerSchema, loginSchema } from "../../../../lib/db/src/schema/index.js";
import { createError } from "../middleware/errorHandler.js";

export async function register(req: Request, res: ExpressResponse, next: NextFunction): Promise<void> {
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

    await db.insert(userIdentitiesTable).values({
      userId: user.id,
      provider: "password",
      providerUserId: user.id.toString(),
      providerEmail: user.email,
    });

    const token = signToken({ userId: user.id, email: user.email, username: user.username });

    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: ExpressResponse, next: NextFunction): Promise<void> {
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

export async function me(req: Request, res: ExpressResponse, next: NextFunction): Promise<void> {
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

export async function googleAuth(req: Request, res: ExpressResponse, next: NextFunction): Promise<void> {
  try {
    const { idToken } = req.body;

    if (!idToken || typeof idToken !== "string") {
      throw createError("Google ID token is required", 400, "INVALID_GOOGLE_DATA");
    }

    // 1. Verify ID Token with Google
    const response = (await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`)) as any;
    if (!response.ok) {
      throw createError("Invalid Google ID token", 401, "INVALID_GOOGLE_TOKEN");
    }
    const payload = (await response.json()) as {
      sub: string;
      email: string;
      email_verified: string | boolean;
      name?: string;
      picture?: string;
      aud: string;
    };

    if (process.env.GOOGLE_CLIENT_ID && payload.aud !== process.env.GOOGLE_CLIENT_ID) {
      throw createError("Invalid Google client ID", 401, "INVALID_GOOGLE_TOKEN");
    }

    if (payload.email_verified !== "true" && payload.email_verified !== true) {
      throw createError("Google email not verified", 400, "EMAIL_NOT_VERIFIED");
    }

    const providerUserId = payload.sub;
    const verifiedEmail = payload.email.toLowerCase().trim();
    const displayName = payload.name;
    const avatarUrl = payload.picture;

    // 2. Lookup identity
    let [identity] = await db
      .select()
      .from(userIdentitiesTable)
      .where(and(eq(userIdentitiesTable.provider, "google"), eq(userIdentitiesTable.providerUserId, providerUserId)))
      .limit(1);

    let user;

    if (identity) {
      [user] = await db.select().from(usersTable).where(eq(usersTable.id, identity.userId)).limit(1);
    } else {
      // 3. Check by email to link accounts
      [user] = await db.select().from(usersTable).where(eq(usersTable.email, verifiedEmail)).limit(1);

      if (user) {
        // Link Google identity
        await db.insert(userIdentitiesTable).values({
          userId: user.id,
          provider: "google",
          providerUserId,
          providerEmail: verifiedEmail,
        });
      } else {
        // 4. Create new user
        let baseUsername = (verifiedEmail.split("@")[0] || "player").replace(/[^a-zA-Z0-9_]/g, "");
        if (baseUsername.length < 3) baseUsername = `player_${Math.floor(1000 + Math.random() * 9000)}`;

        let finalUsername = baseUsername;
        const [takenUsername] = await db
          .select({ id: usersTable.id })
          .from(usersTable)
          .where(eq(usersTable.username, finalUsername))
          .limit(1);

        if (takenUsername) {
          finalUsername = `${baseUsername.slice(0, 20)}_${Math.floor(100 + Math.random() * 900)}`;
        }

        const randomPassword = Math.random().toString(36).slice(-12) + "Nexus$99";
        const passwordHash = await bcrypt.hash(randomPassword, 10);
        const avatarColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 45%)`;

        [user] = await db
          .insert(usersTable)
          .values({
            email: verifiedEmail,
            username: finalUsername,
            passwordHash,
            avatarUrl: avatarUrl || null,
            displayName: displayName || baseUsername,
            avatarColor,
          })
          .returning();

        await db.insert(userIdentitiesTable).values({
          userId: user.id,
          provider: "google",
          providerUserId,
          providerEmail: verifiedEmail,
        });
      }
    }

    if (!user) throw createError("Authentication failed", 500, "AUTH_FAILED");

    const token = signToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    const { passwordHash: _, ...publicUser } = user;
    res.json({ user: publicUser, token });
  } catch (err) {
    next(err);
  }
}

export function logout(_req: Request, res: ExpressResponse): void {
  res.json({ message: "Logged out successfully" });
}
