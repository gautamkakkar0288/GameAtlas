import type { Request, Response, NextFunction } from "express-serve-static-core";
import { db, notificationsTable } from "../../../../lib/db/src/index.js";
import { eq, desc, and } from "../../../../lib/db/src/index.js";

export async function listNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;

    const notifications = await db
      .select()
      .from(notificationsTable)
      .where(eq(notificationsTable.userId, userId))
      .orderBy(desc(notificationsTable.createdAt))
      .limit(20);

    const unreadCount = notifications.filter(n => !n.read).length;

    res.json({ notifications, unreadCount });
  } catch (err) {
    next(err);
  }
}

export async function markRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const notifId = Number(req.params.id);

    await db
      .update(notificationsTable)
      .set({ read: true })
      .where(and(eq(notificationsTable.id, notifId), eq(notificationsTable.userId, userId)));

    res.json({ message: "Marked as read" });
  } catch (err) {
    next(err);
  }
}

export async function markAllRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;

    await db
      .update(notificationsTable)
      .set({ read: true })
      .where(eq(notificationsTable.userId, userId));

    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    next(err);
  }
}
