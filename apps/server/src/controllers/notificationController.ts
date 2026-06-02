import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function getNotifications(req: Request, res: Response) {
  const userId = (req as any).user.id;

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  res.json(notifications);
}

export async function markAsRead(req: Request, res: Response) {
  const userId = (req as any).user.id;
  const notificationId = parseInt((req as any).params.id);

  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification || notification.userId !== userId) {
    res.status(403).json({ error: "Not authorized" });
    return;
  }

  const updated = await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });

  res.json(updated);
}

export async function markAllAsRead(req: Request, res: Response) {
  const userId = (req as any).user.id;

  await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });

  res.json({ success: true });
}