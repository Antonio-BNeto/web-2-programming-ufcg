import { Model, ModelStatic } from "sequelize";

export async function paginate<T extends Model>(
  model: ModelStatic<T>,
  page: number,
  limit: number,
  options: any = {}
) {
  const offset = (page - 1) * limit;
  const { count, rows } = await model.findAndCountAll({
    ...options,
    limit,
    offset,
  });

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    items: rows,
  };
}