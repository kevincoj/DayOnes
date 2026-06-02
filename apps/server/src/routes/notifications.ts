import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../controllers/notificationController";

const router = Router();

router.get("/", authenticateToken, getNotifications);
router.put("/:id", authenticateToken, markAsRead);
router.put("/mark-all-read", authenticateToken, markAllAsRead);

export default router;