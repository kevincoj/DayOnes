import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { getHabits, getHabit, createHabit, updateHabit, deleteHabit, logHabit } from "../controllers/habitController";


const router = Router();

router.get("/", authenticateToken, getHabits);
router.get("/:id", authenticateToken, getHabit);
router.post("/", authenticateToken, createHabit);
router.put("/:id", authenticateToken, updateHabit);
router.delete("/:id", authenticateToken, deleteHabit);
router.post("/:id/log", authenticateToken, logHabit)

export default router;