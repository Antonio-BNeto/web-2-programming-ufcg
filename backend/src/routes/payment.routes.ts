import { Router } from "express";
import { PaymentController } from "../controllers/PaymentController";

const router = Router();
const controller = new PaymentController();

router.post("/", controller.create.bind(controller));
router.get("/", controller.findAll.bind(controller));
router.get("/:id", controller.findById.bind(controller));
router.patch("/:id", controller.update.bind(controller));

export default router;
