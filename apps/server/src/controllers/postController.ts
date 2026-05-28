import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// GET /api/posts — fetch feed for logged-in user
export const getFeed = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  // Step 1: find all accepted partner IDs for this user
  const partnerships = await prisma.partner.findMany({
    where: {
      status: "accepted",
      OR: [
        { userId: userId },
        { partnerId: userId },
      ],
    },
  });

  // Step 2: collect just the IDs of the other person in each partnership
  const partnerIds = partnerships.map((p) =>
    p.userId === userId ? p.partnerId : p.userId
  );

  // Step 3: fetch posts — yours (any visibility) OR partners' non-private posts
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { userId: userId },
        {
          userId: { in: partnerIds },
          visibility: { in: ["friends", "group"] },
        },
      ],
    },
    include: {
      user: {
        select: { username: true },
      },
      habit: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(posts);
};

// POST /api/posts — create a new post
export const createPost = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { habitId, content, visibility } = req.body;

  const post = await prisma.post.create({
    data: {
      userId,
      habitId,
      content,
      visibility: visibility ?? "friends",
    },
    include: {
      user: { select: { username: true } },
      habit: { select: { name: true } },
    },
  });

  res.status(201).json(post);
};

// DELETE /api/posts/:id — delete your own post
export const deletePost = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const postId = parseInt((req as any).params.id);

  // Make sure this post belongs to the logged-in user
  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post || post.userId !== userId) {
    res.status(403).json({ error: "Not authorized" });
    return;
  }

  await prisma.post.delete({ where: { id: postId } });
  res.json({ message: "Post deleted" });
};