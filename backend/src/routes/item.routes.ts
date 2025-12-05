import { Router } from "express";
import { ItemController } from "../controllers/ItemController";

const router = Router();
const controller = new ItemController();

router.post("/", controller.create.bind(controller));
router.get("/", controller.getAll.bind(controller));
router.get("/:id", controller.getById.bind(controller));
router.put("/:id", controller.update.bind(controller));

export default router;
