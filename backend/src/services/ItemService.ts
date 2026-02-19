import Item, { ItemCreationAttributes } from "../models/Item";

class ItemService {

    async createItem(data: ItemCreationAttributes) {
        if (!data.name || !data.description) {
            throw new Error("Nome e descrição são obrigatórios.");
        }

        if (data.price === undefined || data.price < 0) {
            throw new Error("Preço deve ser um valor positivo.");
        }

        if (data.quantity !== undefined && data.quantity < 0) {
            throw new Error("Quantidade não pode ser negativa.");
        }

        const item = await Item.create({
            ...data,
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


    async getAllItems() {
        return await Item.findAll();
    }

    async updateItem(itemId: number, data: Partial<ItemCreationAttributes>) {
        const item = await Item.findByPk(itemId);

        if (!item) {
            throw new Error("Item não encontrado.");
        }

        if (data.price !== undefined && data.price < 0) {
            throw new Error("Preço não pode ser negativo.");
        }

        if (data.quantity !== undefined && data.quantity < 0) {
            throw new Error("Quantidade não pode ser negativa.");
        }

        await item.update(data);
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

        const item = await Item.findByPk(itemId);

        if (!item) {
            throw new Error("Item não encontrado.");
        }

        await item.update({
            quantity: item.quantity + quantity
        });

        return item;
    }

    async removeStock(itemId: number, quantity: number) {
        if (quantity <= 0) {
            throw new Error("Quantidade para remover deve ser maior que zero.");
        }

        const item = await Item.findByPk(itemId);

        if (!item) {
            throw new Error("Item não encontrado.");
        }

        if (item.quantity < quantity) {
            throw new Error("Estoque insuficiente.");
        }

        await item.update({
            quantity: item.quantity - quantity
        });

        return item;
    }
}

export default new ItemService();
