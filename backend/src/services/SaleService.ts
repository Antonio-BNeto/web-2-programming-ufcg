import sequelize from "../config/database";
import Item from "../models/Item";
import Sale, { SaleCreationAttributes } from "../models/Sale";
import SaleItem from "../models/SaleItem";
import SaleRepository from "../repository/SaleRepository";

class SaleService {


    public async createSale(userId: number, description: string, itemsData: { itemId: number, quantity: number }[]) {
        const transaction = await sequelize.transaction();

        try {
            let calculatedTotal = 0;
            const itemsToProcess = [];

            for (const itemRef of itemsData) {
                const item = await Item.findByPk(itemRef.itemId, { transaction });

                if (!item) throw new Error(`Item com ID ${itemRef.itemId} não encontrado.`);
                if (item.quantity < itemRef.quantity) throw new Error(`Estoque insuficiente para o item ${item.name}.`);

                calculatedTotal += item.price * itemRef.quantity;

                itemsToProcess.push({
                    model: item,
                    quantity: itemRef.quantity,
                    unitPrice: item.price
                });
            }

            const sale = await Sale.create({
                valueTotal: calculatedTotal,
                description,
                userId
            }, { transaction });

            for (const itemData of itemsToProcess) {
                await SaleItem.create({
                    saleId: sale.id,
                    itemId: itemData.model.id,
                    quantity: itemData.quantity,
                    unitPrice: itemData.unitPrice
                }, { transaction });

                await itemData.model.update(
                    { quantity: itemData.model.quantity - itemData.quantity },
                    { transaction }
                );
            }

            await transaction.commit();
            return sale;
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
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