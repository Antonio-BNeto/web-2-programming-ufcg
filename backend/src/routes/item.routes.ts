import { Router } from "express";
import { ItemController } from "../controllers/ItemController";

const router = Router();
const controller = new ItemController();

router.post("/", controller.create.bind(controller));
router.get("/", controller.getAll.bind(controller));
router.get("/:id", controller.getById.bind(controller));
router.patch("/:id", controller.update.bind(controller));
router.delete("/:id", controller.delete.bind(controller));

export default router;
