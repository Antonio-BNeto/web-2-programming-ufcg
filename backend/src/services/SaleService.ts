import { SaleCreationAttributes } from "../models/Sale";
import ItemRepository from "../repository/ItemRepository";
import SaleRepository from "../repository/SaleRepository";

class SaleService {


    async createSale(
        saleData: SaleCreationAttributes,
        items: {itemId: number, quantity: number}[]
    ) {
        let calculatedTotal = 0;

        for(const entry of items) {
            const item = await ItemRepository.findById(entry.itemId);

            if (!item) {
                throw new Error(`Item com ID ${entry.itemId} não encontrado.`);
            }

            if (item.quantity< entry.quantity) {
                throw new Error(`Estoque insuficiente para o item: ${item.name}. Disponível: ${item.quantity}`);
            }

            calculatedTotal += item.price * entry.quantity;
        }

        if (Math.abs(calculatedTotal - saleData.valueTotal) > 0.01) {
            throw new Error("O valor total da venda diverge da soma dos itens.");
        }

        const newSale = await SaleRepository.create(saleData);

        for (const entry of items) {
            const item = await ItemRepository.findById(entry.itemId);
            if (item) {
                await item.update({ quantity: item.quantity - entry.quantity });
            }
        }

        return newSale;
    }

    async getSalesByUser(userId: number) {
        return await SaleRepository.findByUser(userId);
    }

    async updateSale(saleId: number, userId: number, data: Partial<SaleCreationAttributes>) {
        await this.validateOwnership(saleId, userId);
        return await SaleRepository.update(saleId, data);
    }

    async validateOwnership(saleId: number, userId: number) {
        const sale = await SaleRepository.findById(saleId);

        if (!sale) {
        throw new Error("Venda não encontrada.");
        }

        if (sale.userId !== userId) {
        throw new Error("Acesso negado: Você não tem permissão para alterar esta venda.");
        }

        return sale;
    }
}

export default new SaleService();