import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface SaleItemAttributes {
  id: number;
  saleId: number;
  itemId: number;
  quantity: number;
  unitPrice: number;
}

export interface SaleItemCreationAttributes extends Optional<SaleItemAttributes, "id"> {}

class SaleItem extends Model<SaleItemAttributes, SaleItemCreationAttributes> implements SaleItemAttributes {
  public id!: number;
  public saleId!: number;
  public itemId!: number;
  public quantity!: number;
  public unitPrice!: number;
}

SaleItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    saleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "sales", key: "id" },
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "items", key: "id" },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "SaleItem",
    tableName: "sale_items",
    timestamps: true,
  }
);

export default SaleItem;