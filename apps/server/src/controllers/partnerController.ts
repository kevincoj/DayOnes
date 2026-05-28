import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// POST /api/partners/invite
// Body: { email: string }
export const invitePartner = async (req: Request, res: Response) => {
  const myId = (req as any).user.id;
  const { username } = req.body;

  // 1. Find the user with that email
  const targetUser = await prisma.user.findUnique({
    where: { username },
  });

  if (!targetUser) {
    return res.status(404).json({ error: "No user found with that email" });
  }

  // 2. Can't invite yourself
  if (targetUser.id === myId) {
    return res.status(400).json({ error: "You can't invite yourself" });
  }

  // 3. Check if a partnership already exists in either direction
  const existing = await prisma.partner.findFirst({
    where: {
      OR: [
        { userId: myId, partnerId: targetUser.id },
        { userId: targetUser.id, partnerId: myId },
      ],
    },
  });

  if (existing) {
    return res.status(400).json({ error: "Partnership already exists" });
  }

  // 4. Create the invite
  const partner = await prisma.partner.create({
    data: {
      userId: myId,
      partnerId: targetUser.id,
      status: "pending",
    },
  });

  res.status(201).json(partner);
};

// PUT /api/partners/:id/accept
export const acceptInvite = async (req: Request, res: Response) => {
  const myId = (req as any).user.id;
  const partnerId = parseInt((req as any).params.id);

  // Find the invite — must be directed AT me and still pending
  const invite = await prisma.partner.findFirst({
    where: {
      id: partnerId,
      partnerId: myId,
      status: "pending",
    },
  });

  if (!invite) {
    return res.status(404).json({ error: "Invite not found" });
  }

  const updated = await prisma.partner.update({
    where: { id: partnerId },
    data: { status: "accepted" },
  });

  res.json(updated);
};

// DELETE /api/partners/:id
export const revokePartner = async (req: Request, res: Response) => {
  const myId = (req as any).user.id;
  const partnerId = parseInt((req as any).params.id);

  // Must be part of this partnership (either side)
  const record = await prisma.partner.findFirst({
    where: {
      id: partnerId,
      OR: [{ userId: myId }, { partnerId: myId }],
    },
  });

  if (!record) {
    return res.status(404).json({ error: "Partnership not found" });
  }

  await prisma.partner.delete({ where: { id: partnerId } });

  res.json({ message: "Partnership removed" });
};

// GET /api/partners
export const getPartners = async (req: Request, res: Response) => {
  const myId = (req as any).user.id;

  const partnerships = await prisma.partner.findMany({
    where: {
      OR: [{ userId: myId }, { partnerId: myId }],
    },
    include: {
      user: { select: { id: true, username: true, email: true } },
      partner: { select: { id: true, username: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(partnerships);
};

// GET /api/partners/:id/habits
export const getPartnerHabits = async (req: Request, res: Response) => {
  const myId = (req as any).user.id;
  const theirId = parseInt((req as any).params.id);

  // Verify we are actually accepted partners
  const partnership = await prisma.partner.findFirst({
    where: {
      status: "accepted",
      OR: [
        { userId: myId, partnerId: theirId },
        { userId: theirId, partnerId: myId },
      ],
    },
  });

  if (!partnership) {
    return res.status(403).json({ error: "Not partners" });
  }

  // Only return habits that aren't private
  const habits = await prisma.habit.findMany({
    where: {
      userId: theirId,
      isActive: true,
      NOT: { socialMode: "private" },
    },
  });

  res.json(habits);
};

// GET /api/users/search?q=
export const searchUsers = async (req: Request, res: Response) => {
  const myId = (req as any).user.id;
  const q = (req as any).query.q as string;

  if (!q || q.trim() === "") {
    return res.json([]);
  }

  const users = await prisma.user.findMany({
    where: {
      username: { contains: q, mode: "insensitive" },
      NOT: { id: myId }, // don't return yourself
    },
    select: { id: true, username: true },
    take: 10,
  });

  res.json(users);
};