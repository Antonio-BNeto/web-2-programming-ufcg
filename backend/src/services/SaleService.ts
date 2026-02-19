import sequelize from "../config/database";
import Item from "../models/Item";
import Sale from "../models/Sale";
import SaleItem from "../models/SaleItem";
import User from "../models/User";
import { SaleItemRequest, SaleUpdateRequest } from "../dto/sale";
import { paginate } from "../utils/pagination";

class SaleService {

    public async getSalesPaginated(userId: number, page: number, limit: number) {
        return await paginate(Sale, page, limit, {
            where: { userId },
            include: [
                { model: User, as: 'user', attributes: ['name', 'email'] },
                {
                    model: Item,
                    as: 'items',
                    through: { attributes: ['quantity', 'unitPrice'] }
                }
            ]
        });
    }

    public async getAllSalesPaginatedAdmin(page: number, limit: number) {
        return await paginate(Sale, page, limit, {
            include: [
                { model: User, as: 'user', attributes: ['name', 'email'] },
                {
                    model: Item,
                    as: 'items',
                    through: { attributes: ['quantity', 'unitPrice'] }
                }
            ]
        });
    }

    public async getSaleById(saleId: number, userId: number, isAdmin: boolean = false) {
        const whereCondition = isAdmin ? { id: saleId } : { id: saleId, userId };

        const sale = await Sale.findOne({
            where: whereCondition,
            include: [
                { model: User, as: 'user', attributes: ['name', 'email'] },
                { model: Item, as: 'items', through: { attributes: ['quantity', 'unitPrice'] } }
            ]
        });

        if (!sale) throw new Error("Venda não encontrada.");
        return sale;
    }

    public async createSale(userId: number, description: string, itemsData: SaleItemRequest[]) {
        const transaction = await sequelize.transaction();
        try {
            let calculatedTotal = 0;
            const itemsToProcess = [];

            for (const itemRef of itemsData) {
                const item = await Item.findByPk(itemRef.itemId, { transaction });
                if (!item) throw new Error(`Item ID ${itemRef.itemId} não encontrado.`);
                if (item.quantity < itemRef.quantity) throw new Error(`Estoque insuficiente: ${item.name}`);

                calculatedTotal += item.price * itemRef.quantity;
                itemsToProcess.push({ model: item, quantity: itemRef.quantity, unitPrice: item.price });
            }

            const sale = await Sale.create({ valueTotal: calculatedTotal, description, userId }, { transaction });

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

    public async updateSale(saleId: number, userId: number, data: SaleUpdateRequest, isAdmin: boolean = false) {
        const whereCondition = isAdmin ? { id: saleId } : { id: saleId, userId };
        const sale = await Sale.findOne({ where: whereCondition });

        if (!sale) throw new Error("Venda não encontrada ou acesso negado.");
        return await sale.update(data);
    }
}

export default new SaleService();