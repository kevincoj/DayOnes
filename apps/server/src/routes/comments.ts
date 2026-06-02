import { Router } from "express";
import {
  getComments,
  createComment,
  deleteComment,
} from "../controllers/commentController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/:postId/comments", authenticateToken, getComments);
router.post("/:postId/comments", authenticateToken, createComment);
router.delete("/:postId/comments/:commentId", authenticateToken, deleteComment);

export default router;
