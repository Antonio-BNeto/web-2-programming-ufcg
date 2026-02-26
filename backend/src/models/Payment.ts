import {
  Model,
  DataTypes,
  Optional,
  NonAttribute,
  ForeignKey
} from "sequelize";
import sequelize from "../config/database";
import Sale from "./Sale";

export type PaymentStatus = "PAID" | "PENDING" | "CANCELLED";

export interface PaymentAttributes {
  id: number;
  saleId: number;
  paymentMethodId: number;
  status: PaymentStatus;
  paymentDate: Date;
  value: number;
}

export interface PaymentCreationAttributes
  extends Optional<PaymentAttributes, "id"> {}

class Payment
  extends Model<PaymentAttributes, PaymentCreationAttributes>
  implements PaymentAttributes
{
  public id!: number;

  public saleId!: ForeignKey<Sale["id"]>;

  public paymentMethodId!: number;

  public status!: PaymentStatus;

  public paymentDate!: Date;

  public value!: number;

  public sale?: NonAttribute<Sale>;
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
      allowNull: false,
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

Payment.belongsTo(Sale, {
  foreignKey: "saleId",
  as: "sale",
});

export default Payment;