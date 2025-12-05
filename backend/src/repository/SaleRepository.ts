import Sale from "../models/Sale";

class SaleRepository {
    async create(data: any) {
        return await Sale.create(data);
    }

    async findAll() {
        return await Sale.findAll();
    }

    async findById(id: number) {
        return await Sale.findByPk(id);
    }

    async update(id: number, data: any) {
        const sale = await this.findById(id);
        if (!sale) return null;

        return await sale.update(data);
    }
}

export default new SaleRepository();
