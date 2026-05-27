import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// GET /api/habits
// Returns all active habits for the logged-in user
export async function getHabits(req: Request, res: Response) {
  const userId = (req as any).user.id;

  const habits = await prisma.habit.findMany({
    where: {
      userId: userId,
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(habits);
}

// POST /api/habits
// Creates a new habit for the logged-in user
export async function createHabit(req: Request, res: Response) {
  const userId = (req as any).user.id;

  const {
    name,
    description,
    triggerCue,
    microVersion,
    obstaclePlan,
    socialMode,
    frequency,
    durationWeeks,
    reward,
  } = req.body;

  if (!name) {
    res.status(400).json({ error: "Habit name is required" });
    return;
  }

  const habit = await prisma.habit.create({
    data: {
      userId,
      name,
      description,
      triggerCue,
      microVersion,
      obstaclePlan,
      socialMode,
      frequency,
      durationWeeks,
      reward,
    },
  });

  res.status(201).json(habit);
}