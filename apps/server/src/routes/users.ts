import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { searchUsers } from "../controllers/partnerController";
import { getProfile, updateProfile, getUserPosts, getFriendsFeed } from "../controllers/userController";

const router = Router();

// /me routes must be defined BEFORE /:username so Express doesn't treat "me" as a username
router.get("/me/friends-feed", authenticateToken, getFriendsFeed);
router.put("/me", authenticateToken, updateProfile);
router.get("/search", authenticateToken, searchUsers);
router.get("/:username", authenticateToken, getProfile);
router.get("/:username/posts", authenticateToken, getUserPosts);

export default router;