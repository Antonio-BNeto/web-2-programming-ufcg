import { Request, Response } from "express";
import SaleRepository from "../repository/SaleRepository";

export class SaleController {
    async create(req: Request, res: Response) {
        try {
            const sale = await SaleRepository.create(req.body);
            return res.status(201).json(sale);
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }

    async getAll(req: Request, res: Response) {
        const sales = await SaleRepository.findAll();
        return res.json(sales);
    }

    async getById(req: Request, res: Response) {
        const sale = await SaleRepository.findById(Number(req.params.id));
        if (!sale) return res.status(404).json({ message: "Venda não encontrada" });
        return res.json(sale);
    }

    async update(req: Request, res: Response) {
        const updated = await SaleRepository.update(Number(req.params.id), req.body);
        if (!updated) return res.status(404).json({ message: "Venda não encontrada" });
        return res.json(updated);
    }
}
