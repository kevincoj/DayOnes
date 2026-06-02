import { Router } from "express";
import { getFeed, createPost, deletePost, updatePost } from "../controllers/postController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/", authenticateToken, getFeed);
router.post("/", authenticateToken, createPost);
router.delete("/:id", authenticateToken, deletePost);
router.put("/:id", authenticateToken, updatePost);

export default router;