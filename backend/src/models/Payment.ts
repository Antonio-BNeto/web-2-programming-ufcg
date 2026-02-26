import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export type PaymentStatus = "PAID" | "PENDING" | "CANCELLED";

export interface PaymentAttributes {
  id: number;
  saleId: number;
  paymentMethodId: number;
  status: PaymentStatus;
  paymentDate: Date | null;
  value: number;
}

export interface PaymentCreationAttributes
  extends Optional<PaymentAttributes, "id" | "paymentDate"> {}

class Payment
  extends Model<PaymentAttributes, PaymentCreationAttributes>
  implements PaymentAttributes
{
  public id!: number;
  public saleId!: number;
  public paymentMethodId!: number;
  public status!: PaymentStatus;
  public paymentDate!: Date | null;
  public value!: number;
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    saleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "sale_id",
    },

    paymentMethodId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "metodo_pagamento_id",
    },

    status: {
      type: DataTypes.ENUM("PAID", "PENDING", "CANCELLED"),
      allowNull: false,
    },

    paymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "data_pagamento",
    },

    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "payments",
    timestamps: false,
  }
);

export default Payment;