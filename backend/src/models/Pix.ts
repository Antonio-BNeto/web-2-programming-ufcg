import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export interface PixAttributes {
  id: number;
  payment_method_id: number;
  key: string;
}

export interface PixCreationAttributes
  extends Optional<PixAttributes, "id"> {}

class Pix
  extends Model<PixAttributes, PixCreationAttributes>
  implements PixAttributes
{
  public id!: number;
  public payment_method_id!: number;
  public key!: string;
}

Pix.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    payment_method_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "pix",
    timestamps: false,
  }
);

export default Pix;
