import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const toggleLike = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const username = (req as any).user.username;
  const postId = parseInt((req as any).params.postId);

  const existing = await prisma.like.findUnique({
    where: {
      postId_userId: { postId, userId },
    },
  });

  if (existing) {
    await prisma.like.delete({
      where: {
        postId_userId: { postId, userId },
      },
    });
    return res.json({ liked: false });
  } else {
    await prisma.like.create({
      data: { postId, userId },
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (post && post.userId !== userId) {
      await prisma.notification.create({
        data: {
          userId: post.userId,
          type: "like",
          message: `${username} liked your post.`,
        },
      });
    }

    return res.json({ liked: true });
  }
};