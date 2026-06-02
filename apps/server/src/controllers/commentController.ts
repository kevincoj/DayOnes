import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getComments = async (req: Request, res: Response) => {
  const postId = parseInt((req as any).params.postId);

  const comments = await prisma.comment.findMany({
    where: { postId },
    include: {
      user: { select: { username: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  res.json(comments);
};

export const createComment = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const username = (req as any).user.username;
  const postId = parseInt((req as any).params.postId);
  const { content } = req.body;

  const comment = await prisma.comment.create({
    data: { postId, userId, content },
    include: {
      user: { select: { username: true } },
    },
  });

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { userId: true },
  });

  if (post && post.userId !== userId) {
    await prisma.notification.create({
      data: {
        userId: post.userId,
        type: "comment",
        message: `${username} commented on your post.`,
      },
    });
  }

  res.status(201).json(comment);
};

export const deleteComment = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const commentId = parseInt((req as any).params.commentId);

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment || comment.userId !== userId) {
    return res.status(403).json({ error: "Not allowed" });
  }

  await prisma.comment.delete({ where: { id: commentId } });
  res.json({ deleted: true });
};