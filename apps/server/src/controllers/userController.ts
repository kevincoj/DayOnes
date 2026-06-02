import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// GET /api/users/:username
export async function getProfile(req: Request, res: Response) {
  const username = req.params.username as string;
  const requesterId = (req as any).user.id as number;

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      isPublic: true,
      createdAt: true,
      habits: {
        where: { isActive: true },
        select: {
          id: true,
          habitLogs: {
            where: { completed: true },
            orderBy: { date: "desc" },
            select: { date: true },
          },
        },
      },
      partnersSent: {
        where: { status: "accepted" },
        select: {
          partner: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      },
      partnersReceived: {
        where: { status: "accepted" },
        select: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const activeHabitsCount = user.habits.length;

  // Best current streak across all active habits
  let bestStreak = 0;
  for (const habit of user.habits) {
    const logs = [...habit.habitLogs].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    let streak = 0;
    for (let i = 0; i < logs.length; i++) {
      const expected = new Date();
      expected.setHours(0, 0, 0, 0);
      expected.setDate(expected.getDate() - i);
      const logDate = new Date(logs[i].date);
      logDate.setHours(0, 0, 0, 0);
      if (logDate.toDateString() === expected.toDateString()) streak++;
      else break;
    }
    if (streak > bestStreak) bestStreak = streak;
  }

  // Completion rate for the current month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const daysThisMonth = now.getDate();
  const expectedThisMonth = activeHabitsCount * daysThisMonth;
  let completedThisMonth = 0;
  for (const habit of user.habits) {
    completedThisMonth += habit.habitLogs.filter(
      (l) => new Date(l.date) >= monthStart,
    ).length;
  }
  const completionRate =
    expectedThisMonth > 0
      ? Math.round((completedThisMonth / expectedThisMonth) * 100)
      : 0;

  const following = user.partnersSent.map((p) => p.partner);
  const followers = user.partnersReceived.map((p) => p.user);

  const isPartner =
    user.id !== requesterId &&
    (following.some((u) => u.id === requesterId) ||
      followers.some((u) => u.id === requesterId));

  res.json({
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    isPublic: user.isPublic,
    isPartner,
    createdAt: user.createdAt,
    stats: {
      currentStreak: bestStreak,
      activeHabits: activeHabitsCount,
      completionRate,
    },
    following,
    followers,
  });
}

// PUT /api/users/me
export async function updateProfile(req: Request, res: Response) {
  const userId = (req as any).user.id;
  const { displayName, bio, isPublic } = req.body;

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { displayName, bio, isPublic },
    select: {
      id: true,
      username: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      isPublic: true,
    },
  });

  res.json(updated);
}
// GET /api/users/:username/posts
export async function getUserPosts(req: Request, res: Response) {
  const username = req.params.username as string;
  const requesterId = (req as any).user.id as number;
  const page = parseInt((req.query.page as string) || "1");
  const limit = 10;
  const offset = (page - 1) * limit;

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, isPublic: true },
  });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  if (!user.isPublic && user.id !== requesterId) {
    const partnership = await prisma.partner.findFirst({
      where: {
        status: "accepted",
        OR: [
          { userId: requesterId, partnerId: user.id },
          { userId: user.id, partnerId: requesterId },
        ],
      },
      select: { id: true },
    });

    if (!partnership) {
      res.json({ posts: [], hasMore: false, isPrivate: true });
      return;
    }
  }

  const posts = await prisma.post.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    skip: offset,
    take: limit + 1,
    include: {
      habit: { select: { name: true } },
      user: { select: { username: true, displayName: true, avatarUrl: true } },
      _count: { select: { likes: true } },
      likes: {
        where: { userId: requesterId },
        select: { id: true },
      },
    },
  });

  const hasMore = posts.length > limit;
  const shaped = posts.slice(0, limit).map((post) => ({
    ...post,
    likeCount: post._count.likes,
    likedByMe: post.likes.length > 0,
    _count: undefined,
    likes: undefined,
  }));

  res.json({ posts: shaped, hasMore, isPrivate: false });
}

// GET /api/users/me/friends-feed
export async function getFriendsFeed(req: Request, res: Response) {
  const userId = (req as any).user.id;
  const page = parseInt((req.query.page as string) || "1");
  const limit = 10;
  const offset = (page - 1) * limit;

  const partnerships = await prisma.partner.findMany({
    where: {
      OR: [
        { userId, status: "accepted" },
        { partnerId: userId, status: "accepted" },
      ],
    },
  });

  const friendIds = partnerships.map((p) =>
    p.userId === userId ? p.partnerId : p.userId,
  );

  if (friendIds.length === 0) {
    res.json({ posts: [], hasMore: false });
    return;
  }

  const posts = await prisma.post.findMany({
    where: {
      userId: { in: friendIds },
      visibility: { in: ["friends", "group"] },
    },
    orderBy: { createdAt: "desc" },
    skip: offset,
    take: limit + 1,
    include: {
      habit: { select: { name: true } },
      user: { select: { username: true, displayName: true, avatarUrl: true } },
      _count: { select: { likes: true, comments: true } },
      likes: {
        where: { userId },
        select: { id: true },
      },
    },
  });

  const hasMore = posts.length > limit;
  const shaped = posts.slice(0, limit).map((post) => ({
    ...post,
    likeCount: post._count.likes,
    commentCount: post._count.comments,
    likedByMe: post.likes.length > 0,
    _count: undefined,
    likes: undefined,
  }));

  res.json({ posts: shaped, hasMore });
}
