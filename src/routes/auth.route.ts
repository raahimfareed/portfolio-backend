import { authenticate, setupUser, validateSession } from "@/controllers/auth.controller";
import express, { Router } from "express";

const router = Router();

router.post('/', express.json(), authenticate);
router.post('/setup', setupUser);
router.post('/validate-session', validateSession);

export default router;
