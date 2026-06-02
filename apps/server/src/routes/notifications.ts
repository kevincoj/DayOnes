import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../controllers/notificationController";

const router = Router();

router.get("/", authenticateToken, getNotifications);
router.put("/mark-all-read", authenticateToken, markAllAsRead);
router.put("/:id", authenticateToken, markAsRead);

export default router;