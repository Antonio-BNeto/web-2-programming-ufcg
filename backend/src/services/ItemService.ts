import sequelize from "../config/database";
import Item, { ItemCreationAttributes } from "../models/Item";

class ItemService {

    async createItem(data: ItemCreationAttributes) {
        if (!data.name || !data.description) {
            throw new Error("Nome e descrição são obrigatórios.");
        }

        if (data.price === undefined || Number(data.price) < 0) {
            throw new Error("Preço deve ser um valor positivo.");
        }

        if (data.quantity !== undefined && data.quantity < 0) {
            throw new Error("Quantidade não pode ser negativa.");
        }

        const item = await Item.create({
            ...data,
            price: Number(data.price),
            quantity: data.quantity ?? 0
        });

        return item;
    }

    async getItemById(itemId: number) {
        const item = await Item.findByPk(itemId);

        if (!item) {
            throw new Error("Item não encontrado.");
        }

        return item;
    }

    async getAllItems(page: number = 1, limit: number = 10) {
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const offset = (page - 1) * limit;

    const { rows, count } = await Item.findAndCountAll({
        order: [["id", "DESC"]],
        limit,
        offset
    });

    return {
        items: rows,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
    };
}

    async updateItem(itemId: number, data: Partial<ItemCreationAttributes>) {
        const item = await Item.findByPk(itemId);

        if (!item) {
            throw new Error("Item não encontrado.");
        }

        if (data.price !== undefined && Number(data.price) < 0) {
            throw new Error("Preço não pode ser negativo.");
        }

        if (data.quantity !== undefined && data.quantity < 0) {
            throw new Error("Quantidade não pode ser negativa.");
        }

        await item.update({
            ...data,
            price: data.price !== undefined ? Number(data.price) : item.price
        });

        return item;
    }

    async deleteItem(itemId: number) {
        const item = await Item.findByPk(itemId);

        if (!item) {
            throw new Error("Item não encontrado.");
        }

        await item.destroy();

        return { message: "Item removido com sucesso." };
    }

    async addStock(itemId: number, quantity: number) {
        if (quantity <= 0) {
            throw new Error("Quantidade para adicionar deve ser maior que zero.");
        }

        const transaction = await sequelize.transaction();

        try {
            const item = await Item.findByPk(itemId, {
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if (!item) {
                throw new Error("Item não encontrado.");
            }

            await item.update(
                {
                    quantity: item.quantity + quantity
                },
                { transaction }
            );

            await transaction.commit();
            return item;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async removeStock(itemId: number, quantity: number) {
        if (quantity <= 0) {
            throw new Error("Quantidade para remover deve ser maior que zero.");
        }

        const transaction = await sequelize.transaction();

        try {
            const item = await Item.findByPk(itemId, {
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if (!item) {
                throw new Error("Item não encontrado.");
            }

            if (item.quantity < quantity) {
                throw new Error("Estoque insuficiente.");
            }

            await item.update(
                {
                    quantity: item.quantity - quantity
                },
                { transaction }
            );

            await transaction.commit();
            return item;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

export default new ItemService();