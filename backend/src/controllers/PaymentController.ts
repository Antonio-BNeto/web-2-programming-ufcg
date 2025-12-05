import { Request, Response } from "express";
import { PaymentRepository } from "../repository/PaymentRepository";

const repository = new PaymentRepository();

export class PaymentController {

    async create(req: Request, res: Response) {
        try {
            const payment = await repository.create(req.body);
            return res.status(201).json(payment);
        } catch (error) {
            return res.status(400).json({ error: "Failed to create payment", details: error });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const payments = await repository.findAll();
            return res.json(payments);
        } catch (error) {
            return res.status(500).json({ error: "Failed to fetch payments" });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const payment = await repository.findById(id);

            if (!payment) return res.status(404).json({ error: "Payment not found" });

            return res.json(payment);
        } catch (error) {
            return res.status(500).json({ error: "Failed to fetch payment" });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const updated = await repository.update(id, req.body);

            if (!updated) return res.status(404).json({ error: "Payment not found" });

            return res.json(updated);
        } catch (error) {
            return res.status(400).json({ error: "Failed to update payment" });
        }
    }
}
