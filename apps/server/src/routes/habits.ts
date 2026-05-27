import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { getHabits, createHabit } from "../controllers/habitController";

const router = Router();

router.get("/", authenticateToken, getHabits);
router.post("/", authenticateToken, createHabit);

export default router;