import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export interface CardAttributes {
  id: number;
  payment_method_id: number;
  holder_name: string;
  card_number: string;
  expiration_month: number;
  expiration_year: number;
  cvv: string;
}

export interface CardCreationAttributes
  extends Optional<CardAttributes, "id"> {}

class Card
  extends Model<CardAttributes, CardCreationAttributes>
  implements CardAttributes
{
  public id!: number;
  public payment_method_id!: number;
  public holder_name!: string;
  public card_number!: string;
  public expiration_month!: number;
  public expiration_year!: number;
  public cvv!: string;
}

Card.init(
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

    holder_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    card_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    expiration_month: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    expiration_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    cvv: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "cards",
    timestamps: false,
  }
);

export default Card;
