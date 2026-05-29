import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// GET /api/posts — fetch feed for logged-in user
export const getFeed = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  // find all accepted partner IDs for this user
  const partnerships = await prisma.partner.findMany({
    where: {
      status: "accepted",
      OR: [
        { userId: userId },
        { partnerId: userId },
      ],
    },
  });

  // collect just the IDs of the other person
  const partnerIds = partnerships.map((p) =>
    p.userId === userId ? p.partnerId : p.userId
  );

  // fetch posts 
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

// PUT /api/posts/:id — edit your own post
export const updatePost = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const postId = parseInt((req as any).params.id);
  const { content, visibility } = req.body;

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.userId !== userId) {
    res.status(403).json({ error: "Not authorized" });
    return;
  }

  const updated = await prisma.post.update({
    where: { id: postId },
    data: { content, visibility },
    include: {
      user: { select: { username: true } },
      habit: { select: { name: true } },
    },
  });

  res.json(updated);
};