import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { searchUsers } from "../controllers/partnerController";

const router = Router();

router.get("/search", authenticateToken, searchUsers);

export default router;