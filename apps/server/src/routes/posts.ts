import { Router } from "express";
import { getFeed, createPost, deletePost } from "../controllers/postController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/", authenticateToken, getFeed);
router.post("/", authenticateToken, createPost);
router.delete("/:id", authenticateToken, deletePost);

export default router;