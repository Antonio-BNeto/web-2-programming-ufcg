import Sale, { SaleAttributes, SaleCreationAttributes } from "../models/Sale";

class SaleRepository {
    async create(data: SaleCreationAttributes): Promise<Sale> {
        return await Sale.create(data);
    }

    async findAll(): Promise<Sale[]> {
        return await Sale.findAll();
    }

    async findById(id: number): Promise<Sale | null> {
        return await Sale.findByPk(id);
    }

    async findByUser(userId: number):Promise<Sale[]> {
        return await Sale.findAll({
            where: {
                userId: userId
            }
        });
    }

    async update(id: number, data: Partial<SaleAttributes>): Promise<Sale | null> {
        const sale = await this.findById(id);
        if (!sale) return null;

        return await sale.update(data);
    }
}

export default new SaleRepository();
