import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// POST /api/pacts/invite
// Habit owner invites a partner to join their habit as a Pact
export async function inviteToPact(req: Request, res: Response) {
  const userId = (req as any).user.id;
  const username = (req as any).user.username;
  const { habitId, partnerUsername } = req.body;

  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId },
  });

  if (!habit) {
    res.status(404).json({ error: "Habit not found" });
    return;
  }

  const partner = await prisma.user.findUnique({
    where: { username: partnerUsername },
  });

  if (!partner) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  if (partner.id === userId) {
    res.status(400).json({ error: "You can't pact with yourself" });
    return;
  }

  const existing = await prisma.habitMember.findUnique({
    where: { habitId_userId: { habitId, userId: partner.id } },
  });

  if (existing) {
    res.status(400).json({ error: "Invite already sent" });
    return;
  }

  const membership = await prisma.habitMember.create({
    data: { habitId, userId: partner.id, status: "pending" },
  });

  await prisma.notification.create({
    data: {
      userId: partner.id,
      type: "pact_invite",
      message: `${username} invited you to join their habit "${habit.name}" as a Pact!`,
    },
  });

  res.status(201).json(membership);
}

// PUT /api/pacts/:id/accept
// Partner accepts a Pact invite
export async function acceptPact(req: Request, res: Response) {
  const userId = (req as any).user.id;
  const username = (req as any).user.username;
  const membershipId = parseInt((req as any).params.id);

  const membership = await prisma.habitMember.findFirst({
    where: { id: membershipId, userId, status: "pending" },
    include: { habit: true },
  });

  if (!membership) {
    res.status(404).json({ error: "Invite not found" });
    return;
  }

  const updated = await prisma.habitMember.update({
    where: { id: membershipId },
    data: { status: "accepted" },
  });

  await prisma.notification.create({
    data: {
      userId: membership.habit.userId,
      type: "pact_accepted",
      message: `${username} accepted your Pact invite for "${membership.habit.name}"!`,
    },
  });

  res.json(updated);
}

// DELETE /api/pacts/:id
// Leave or revoke a Pact
export async function leavePact(req: Request, res: Response) {
  const userId = (req as any).user.id;
  const membershipId = parseInt((req as any).params.id);

  const membership = await prisma.habitMember.findFirst({
    where: { id: membershipId },
    include: { habit: true },
  });

  if (!membership) {
    res.status(404).json({ error: "Pact not found" });
    return;
  }

  const isOwner = membership.habit.userId === userId;
  const isMember = membership.userId === userId;

  if (!isOwner && !isMember) {
    res.status(403).json({ error: "Not authorized" });
    return;
  }

  await prisma.habitMember.delete({ where: { id: membershipId } });
  res.json({ message: "Left pact" });
}

// GET /api/pacts/pending
// Get all pending Pact invites for the logged-in user
export async function getPendingInvites(req: Request, res: Response) {
  const userId = (req as any).user.id;

  const invites = await prisma.habitMember.findMany({
    where: { userId, status: "pending" },
    include: {
      habit: {
        include: {
          user: { select: { username: true } },
        },
      },
    },
  });

  res.json(invites);
}

// GET /api/pacts/habit/:habitId
// Get pact partner's logs for a given habit (for side-by-side view)
export async function getPactPartnerLogs(req: Request, res: Response) {
  const userId = (req as any).user.id;
  const habitId = parseInt((req as any).params.habitId);

  const habit = await prisma.habit.findFirst({
    where: { id: habitId },
    include: {
      habitMembers: {
        where: { status: "accepted" },
        include: { user: { select: { id: true, username: true } } },
      },
      user: { select: { id: true, username: true } },
    },
  });

  if (!habit) {
    res.status(404).json({ error: "Habit not found" });
    return;
  }

  const isOwner = habit.userId === userId;
  const isMember = habit.habitMembers.some((m) => m.userId === userId);

  if (!isOwner && !isMember) {
    res.status(403).json({ error: "Not authorized" });
    return;
  }

  const partnerId = isOwner
    ? habit.habitMembers[0]?.userId
    : habit.userId;

  const partnerInfo = isOwner
    ? habit.habitMembers[0]?.user
    : habit.user;

  if (!partnerId) {
    res.json({ partnerLogs: [], partnerUsername: null });
    return;
  }

  const partnerLogs = await prisma.habitLog.findMany({
    where: { habitId, userId: partnerId, completed: true },
    orderBy: { date: "asc" },
  });

  const logDates = partnerLogs.map((l) => new Date(l.date).toISOString().split("T")[0]);

  res.json({ partnerLogs: logDates, partnerUsername: partnerInfo?.username });
}