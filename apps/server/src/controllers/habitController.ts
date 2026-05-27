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

// GET /api/habits/:id
// Returns a single habit for the logged-in user
export async function getHabit(req: Request, res: Response) {
  const userId = (req as any).user.id;
  const habitId = parseInt((req as any).params.id);

  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId: userId },
  });

  if (!habit) {
    res.status(404).json({ error: "Habit not found" });
    return;
  }

  res.json(habit);
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

// PUT /api/habits/:id
// Updates an existing habit for the logged-in user
export async function updateHabit(req: Request, res: Response) {
  const userId = (req as any).user.id;
  const habitId = parseInt((req as any).params.id);

  const existing = await prisma.habit.findFirst({
    where: { id: habitId, userId: userId },
  });

  if (!existing) {
    res.status(404).json({ error: "Habit not found" });
    return;
  }

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

  const updated = await prisma.habit.update({
    where: { id: habitId },
    data: {
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

  res.json(updated);
}

// DELETE /api/habits/:id
// Soft deletes a habit by setting isActive = false
export async function deleteHabit(req: Request, res: Response) {
  const userId = (req as any).user.id;
  const habitId = parseInt((req as any).params.id);

  const existing = await prisma.habit.findFirst({
    where: { id: habitId, userId: userId },
  });

  if (!existing) {
    res.status(404).json({ error: "Habit not found" });
    return;
  }

  await prisma.habit.update({
    where: { id: habitId },
    data: { isActive: false },
  });

  res.json({ message: "Habit deleted" });
}