import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import {
  invitePartner,
  acceptInvite,
  revokePartner,
  getPartners,
  getPartnerHabits,
} from "../controllers/partnerController";

const router = Router();

router.get("/", authenticateToken, getPartners);
router.post("/invite", authenticateToken, invitePartner);
router.put("/:id/accept", authenticateToken, acceptInvite);
router.delete("/:id", authenticateToken, revokePartner);
router.get("/:id/habits", authenticateToken, getPartnerHabits);

export default router;