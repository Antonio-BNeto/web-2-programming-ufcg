import Item from "../models/Item";

class ItemRepository {
    async create(data: any) {
        return await Item.create(data);
    }

    async findAll() {
        return await Item.findAll();
    }

    async findById(id: number) {
        return await Item.findByPk(id);
    }

    async update(id: number, data: any) {
        const item = await Item.findByPk(id);
        if (!item) return null;

        await item.update(data);
        return item;
    }

    async delete(id: number) {
        const item = await Item.findByPk(id);

        if(!item) {
            return null;
        }

        await item.destroy();
        return item;
    }
}

export default new ItemRepository();
