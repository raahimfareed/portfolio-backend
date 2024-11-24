import { create, destroy, get, getAll, update } from "@/controllers/project.controller";
import { json, Router } from "express";

const router = Router();

router.get('/', getAll);
router.post('/', json(), create);
router.get('/:id', get);
router.patch('/:id', json(), update);
router.delete('/:id', destroy);

export default router;
