import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// GET /api/habits
// Returns all active habits for the logged-in user
export async function getHabits(req: Request, res: Response) {
  const userId = (req as any).user.id

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay()) // Sunday

  const habits = await prisma.habit.findMany({
    where: { userId, isActive: true },
    orderBy: { createdAt: "desc" },
    include: {
      habitLogs: {
        where: { completed: true },
        orderBy: { date: "desc" },
      },
    },
  })

  const habitsWithStats = habits.map((habit) => {
    const logs = habit.habitLogs

    // Streak
    let currentStreak = 0
    for (let i = 0; i < logs.length; i++) {
      const expected = new Date()
      expected.setHours(0, 0, 0, 0)
      expected.setDate(expected.getDate() - i)
      const logDate = new Date(logs[i].date)
      logDate.setHours(0, 0, 0, 0)
      if (logDate.toDateString() === expected.toDateString()) currentStreak++
      else break
    }

    const loggedToday = logs.some((l) => {
      const d = new Date(l.date)
      return d >= today && d < tomorrow
    })

    const logsThisWeek = logs.filter((l) => new Date(l.date) >= weekStart).length

    const { habitLogs, ...habitData } = habit
    return { ...habitData, currentStreak, totalCompleted: logs.length, loggedToday, logsThisWeek }
  })

  res.json(habitsWithStats)
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

// POST /api/habits/:id/log
export async function logHabit(req: Request, res: Response) {
  const userId = (req as any).user.id
  const habitId = parseInt((req as any).params.id)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const existing = await prisma.habitLog.findFirst({
    where: {
      habitId,
      userId,
      date: { gte: today, lt: tomorrow },
    },
  })

  if (existing) {
    res.status(400).json({ error: "Already logged today" })
    return
  }

  const log = await prisma.habitLog.create({
    data: {
      habitId,
      userId,
      date: new Date(),
      completed: true,
    },
  })

  res.status(201).json(log)
}