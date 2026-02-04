import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export interface PaymentMethodAttributes {
  id: number;
  user_id: number;
  type: "PIX" | "CARD" | "BANK_ACCOUNT";
  main: boolean;
}

export interface PaymentMethodCreationAttributes
  extends Optional<PaymentMethodAttributes, "id" | "main"> {}

class PaymentMethod
  extends Model<PaymentMethodAttributes, PaymentMethodCreationAttributes>
  implements PaymentMethodAttributes
{
  public id!: number;
  public user_id!: number;
  public type!: "PIX" | "CARD" | "BANK_ACCOUNT";
  public main!: boolean;
}

PaymentMethod.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM("PIX", "CARD", "BANK_ACCOUNT"),
      allowNull: false,
    },

    main: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "payment_methods",
    timestamps: false,
  }
);

export default PaymentMethod;
