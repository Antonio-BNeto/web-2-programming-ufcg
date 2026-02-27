import sequelize from "../config/database";
import Item from "../models/Item";
import Sale from "../models/Sale";
import SaleItem from "../models/SaleItem";
import User from "../models/User";
import { SaleItemRequest, SaleUpdateRequest } from "../dto/sale";
import { paginate } from "../utils/pagination";

class SaleService {

  async getSalesPaginated(
    userId: number,
    page: number,
    limit: number
  ) {
    return await paginate(Sale, page, limit, {
      where: { userId },
      include: this.defaultIncludes(),
      order: [["id", "DESC"]],
    });
  }

  async getAllSalesPaginatedAdmin(
    page: number,
    limit: number
  ) {
    return await paginate(Sale, page, limit, {
      include: this.defaultIncludes(),
      order: [["id", "DESC"]],
    });
  }

  async getSaleById(
    saleId: number,
    userId: number,
    isAdmin: boolean = false
  ) {
    const where = isAdmin
      ? { id: saleId }
      : { id: saleId, userId };

    const sale = await Sale.findOne({
      where,
      include: this.defaultIncludes(),
    });

    if (!sale) {
      throw new Error("Venda não encontrada ou acesso negado.");
    }

    return sale;
  }

  async createSale(
    userId: number,
    description: string,
    itemsData: SaleItemRequest[]
  ) {
    const transaction = await sequelize.transaction();

    try {
      if (!itemsData || itemsData.length === 0) {
        throw new Error("A venda deve conter ao menos um item.");
      }

      let total = 0;
      const itemsToProcess: {
        item: Item;
        quantity: number;
        unitPrice: number;
      }[] = [];

      for (const ref of itemsData) {
        const item = await Item.findByPk(ref.itemId, { transaction });

        if (!item) {
          throw new Error(`Item ${ref.itemId} não encontrado.`);
        }

        if (item.quantity < ref.quantity) {
          throw new Error(`Estoque insuficiente: ${item.name}`);
        }

        const price = Number(item.price);
        total += price * ref.quantity;

        itemsToProcess.push({
          item,
          quantity: ref.quantity,
          unitPrice: price,
        });
      }

      const sale = await Sale.create(
        {
          userId,
          description,
          valueTotal: total,
          status: "NEGOTIATING",
        },
        { transaction }
      );

      for (const data of itemsToProcess) {
        await SaleItem.create(
          {
            saleId: sale.id,
            itemId: data.item.id,
            quantity: data.quantity,
            unitPrice: data.unitPrice,
          },
          { transaction }
        );

        await data.item.update(
          { quantity: data.item.quantity - data.quantity },
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

  async updateSale(
    saleId: number,
    userId: number,
    data: SaleUpdateRequest,
    isAdmin: boolean = false
  ) {
    const where = isAdmin
      ? { id: saleId }
      : { id: saleId, userId };

    const sale = await Sale.findOne({ where });

    if (!sale) {
      throw new Error("Venda não encontrada ou acesso negado.");
    }

    if (sale.status === "PAID" || sale.status === "CANCELLED") {
      throw new Error("Venda finalizada não pode ser alterada.");
    }

    const allowedUpdates: Partial<SaleUpdateRequest> = {
      description: data.description,
      status: data.status,
    };

    return await sale.update(allowedUpdates);
  }

  private defaultIncludes() {
    return [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email"],
      },
      {
        model: Item,
        as: "items",
        through: {
          attributes: ["quantity", "unitPrice"],
        },
      },
    ];
  }
}

export default new SaleService();