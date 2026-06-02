import { Router } from "express";
import { toggleLike } from "../controllers/likeController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.post("/:postId/like", authenticateToken, toggleLike);

export default router;
