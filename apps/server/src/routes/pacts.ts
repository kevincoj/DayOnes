import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import {
    inviteToPact,
    acceptPact,
    leavePact,
    getPendingInvites,
    getPactPartnerLogs,
} from "../controllers/pactController";

const router = Router();

router.use(authenticateToken);

router.get("/pending", getPendingInvites);
router.get("/habit/:habitId", getPactPartnerLogs);
router.post("/invite", inviteToPact);
router.put("/:id/accept", acceptPact);
router.delete("/:id", leavePact);

export default router;