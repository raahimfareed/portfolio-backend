import { create } from "@/controllers/image.controller";
import { Router } from "express";

const router = Router();
router.post('/', create);

export default router;
