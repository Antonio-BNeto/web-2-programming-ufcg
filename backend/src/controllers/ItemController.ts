import { Request, Response } from "express";
import ItemRepository from "../repository/ItemRepository";

export class ItemController {
    async create(req: Request, res: Response) {
        try {
            const item = await ItemRepository.create(req.body);
            return res.status(201).json(item);
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }

    async getAll(req: Request, res: Response) {
        const items = await ItemRepository.findAll();
        return res.json(items);
    }

    async getById(req: Request, res: Response) {
        const item = await ItemRepository.findById(Number(req.params.id));
        if (!item) return res.status(404).json({ message: "Item não encontrado" });
        return res.json(item);
    }

    async update(req: Request, res: Response) {
        const updated = await ItemRepository.update(Number(req.params.id), req.body);
        if (!updated) return res.status(404).json({ message: "Item não encontrado" });
        return res.json(updated);
    }
}
