import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { getHabits, createHabit, updateHabit, deleteHabit } from "../controllers/habitController";

const router = Router();

router.get("/", authenticateToken, getHabits);
router.post("/", authenticateToken, createHabit);
router.put("/:id", authenticateToken, updateHabit);
router.delete("/:id", authenticateToken, deleteHabit);

export default router;