import { Router } from "express";
import { SaleController } from "../controllers/SaleController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();
const controller = new SaleController();

router.post("/", authenticate, controller.create.bind(controller));
router.get("/", authenticate, controller.getAll.bind(controller));
router.get("/:id", authenticate, controller.getById.bind(controller));
router.patch("/:id", authenticate, controller.update.bind(controller));

export default router;
