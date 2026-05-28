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
  const userId = (req as any).user.id
  const habitId = parseInt((req as any).params.id)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())

  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId },
    include: {
      habitLogs: {
        where: { completed: true },
        orderBy: { date: "asc" },
      },
    },
  })

  if (!habit) {
    res.status(404).json({ error: "Habit not found" })
    return
  }

  const logs = habit.habitLogs
  const sortedDesc = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  let currentStreak = 0
  for (let i = 0; i < sortedDesc.length; i++) {
    const expected = new Date()
    expected.setHours(0, 0, 0, 0)
    expected.setDate(expected.getDate() - i)
    const logDate = new Date(sortedDesc[i].date)
    logDate.setHours(0, 0, 0, 0)
    if (logDate.toDateString() === expected.toDateString()) currentStreak++
    else break
  }

  const loggedToday = logs.some((l) => {
    const d = new Date(l.date)
    return d >= today && d < tomorrow
  })

  const logsThisWeek = logs.filter((l) => new Date(l.date) >= weekStart).length
  const logDates = logs.map((l) => new Date(l.date).toISOString().split("T")[0])

  const { habitLogs, ...habitData } = habit
  res.json({
    ...habitData,
    currentStreak,
    totalCompleted: logs.length,
    loggedToday,
    logsThisWeek,
    logDates,
  })
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
  const { date: dateParam } = req.body || {}

  const targetDate = dateParam ? new Date(dateParam + "T12:00:00") : new Date()
  targetDate.setHours(0, 0, 0, 0)
  const dayAfter = new Date(targetDate)
  dayAfter.setDate(dayAfter.getDate() + 1)

  // Prevent logging future dates
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  if (targetDate > now) {
    res.status(400).json({ error: "Cannot log a future date" })
    return
  }

  const existing = await prisma.habitLog.findFirst({
    where: { habitId, userId, date: { gte: targetDate, lt: dayAfter } },
  })

  if (existing) {
    res.status(400).json({ error: "Already logged this day" })
    return
  }

  const log = await prisma.habitLog.create({
    data: { habitId, userId, date: targetDate, completed: true },
  })

  res.status(201).json(log)
}

export async function deleteLog(req: Request, res: Response) {
  const userId = (req as any).user.id
  const habitId = parseInt((req as any).params.id)
  const { date } = req.body

  const targetDate = new Date(date + "T12:00:00")
  targetDate.setHours(0, 0, 0, 0)
  const dayAfter = new Date(targetDate)
  dayAfter.setDate(dayAfter.getDate() + 1)

  const log = await prisma.habitLog.findFirst({
    where: { habitId, userId, date: { gte: targetDate, lt: dayAfter } },
  })

  if (!log) {
    res.status(404).json({ error: "Log not found" })
    return
  }

  await prisma.habitLog.delete({ where: { id: log.id } })
  res.json({ message: "Log removed" })
}