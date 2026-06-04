import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { getHabits, getHabit, searchHabits, createHabit, updateHabit, deleteHabit, logHabit, deleteLog } from "../controllers/habitController";


const router = Router();

router.get("/", authenticateToken, getHabits);
router.get("/search", authenticateToken, searchHabits);
router.get("/:id", authenticateToken, getHabit);
router.post("/", authenticateToken, createHabit);
router.put("/:id", authenticateToken, updateHabit);
router.delete("/:id", authenticateToken, deleteHabit);
router.post("/:id/log", authenticateToken, logHabit)
router.delete("/:id/log", authenticateToken, deleteLog)

export default router;