import { Router } from "express";
import { SaleController } from "../controllers/SaleController";

const router = Router();
const controller = new SaleController();

router.post("/", controller.create.bind(controller));
router.get("/", controller.getAll.bind(controller));
router.get("/:id", controller.getById.bind(controller));
router.put("/:id", controller.update.bind(controller));

export default router;
