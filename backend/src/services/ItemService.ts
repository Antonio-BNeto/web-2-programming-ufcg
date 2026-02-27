import sequelize from "../config/database";
import { ItemRequest } from "../dto/item";
import Item from "../models/Item";
import { AppError } from "../errors/AppError";

class ItemService {
  async createItem(userId: number, data: ItemRequest) {
    if (!data.name || !data.description) {
      throw new AppError("Nome e descrição são obrigatórios.", 400);
    }
    if (data.price === undefined || Number(data.price) < 0) {
      throw new AppError("Preço deve ser um valor positivo.", 400);
    }
    if (data.quantity !== undefined && data.quantity < 0) {
      throw new AppError("Quantidade não pode ser negativa.", 400);
    }

    const item = await Item.create({
      name: data.name,
      description: data.description,
      price: Number(data.price),
      quantity: data.quantity ?? 0,
      userId
    });

    return item;
  }

  async getItemById(itemId: number) {
    const item = await Item.findByPk(itemId);
    if (!item) throw new AppError("Item não encontrado.", 404);
    return item;
  }

  async getAllItems(page = 1, limit = 10) {
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

  async getItemsByUser(userId: number) {
    return Item.findAll({
      where: { userId },
      order: [["id", "DESC"]]
    });
  }

  async updateItem(itemId: number, userId: number, data: Partial<ItemRequest>) {
    const item = await Item.findOne({ where: { id: itemId, userId } });
    if (!item) throw new AppError("Item não encontrado ou acesso negado.", 404);

    if (data.price !== undefined && Number(data.price) < 0) {
      throw new AppError("Preço não pode ser negativo.", 400);
    }
    if (data.quantity !== undefined && data.quantity < 0) {
      throw new AppError("Quantidade não pode ser negativa.", 400);
    }

    await item.update({
      ...data,
      price: data.price !== undefined ? Number(data.price) : item.price
    });

    return item;
  }

  async deleteItem(itemId: number, userId: number) {
    const item = await Item.findOne({ where: { id: itemId, userId } });
    if (!item) throw new AppError("Item não encontrado ou acesso negado.", 404);
    await item.destroy();
  }

  async addStock(itemId: number, userId: number, quantity: number) {
    if (quantity <= 0) throw new AppError("Quantidade deve ser maior que zero.", 400);

    const transaction = await sequelize.transaction();
    try {
      const item = await Item.findOne({
        where: { id: itemId, userId },
        transaction,
        lock: transaction.LOCK.UPDATE
      });
      if (!item) throw new AppError("Item não encontrado ou acesso negado.", 404);

      await item.update({ quantity: item.quantity + quantity }, { transaction });
      await transaction.commit();
      return item;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async removeStock(itemId: number, userId: number, quantity: number) {
    if (quantity <= 0) throw new AppError("Quantidade deve ser maior que zero.", 400);

    const transaction = await sequelize.transaction();
    try {
      const item = await Item.findOne({
        where: { id: itemId, userId },
        transaction,
        lock: transaction.LOCK.UPDATE
      });
      if (!item) throw new AppError("Item não encontrado ou acesso negado.", 404);
      if (item.quantity < quantity) throw new AppError("Estoque insuficiente.", 400);

      await item.update({ quantity: item.quantity - quantity }, { transaction });
      await transaction.commit();
      return item;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default new ItemService();