import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const toggleLike = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const postId = parseInt((req as any).params.postId);

  // Check if this user already liked this post
  const existing = await prisma.like.findUnique({
    where: {
      postId_userId: { postId, userId },
    },
  });

  if (existing) {
    // Already liked — delete it (unlike)
    await prisma.like.delete({
      where: {
        postId_userId: { postId, userId },
      },
    });
    return res.json({ liked: false });
  } else {
    // Not liked yet — create it (like)
    await prisma.like.create({
      data: { postId, userId },
    });
    return res.json({ liked: true });
  }
};
