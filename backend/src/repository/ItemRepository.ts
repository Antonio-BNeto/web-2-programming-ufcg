import Item, { ItemAttributes, ItemCreationAttributes } from "../models/Item";

class ItemRepository {
    async create(data: ItemCreationAttributes): Promise<Item> {
        return await Item.create(data);
    }

    async findAll(): Promise<Item[]> {
        return await Item.findAll();
    }

    async findById(id: number): Promise<Item | null> {
        return await Item.findByPk(id);
    }

    async update(id: number, data: Partial<ItemAttributes>): Promise<Item|null> {
        const item = await Item.findByPk(id);
        if (!item) return null;

        await item.update(data);
        return item;
    }

    async delete(id: number): Promise<Item | null> {
        const item = await Item.findByPk(id);

        if(!item) {
            return null;
        }

        await item.destroy();
        return item;
    }
}

export default new ItemRepository();
