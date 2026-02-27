import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export interface SaleAttributes {
  id: number;
  valueTotal: number;
  description: string;
  userId: number;
  status: "NEGOTIATING" | "CONFIRMED" | "PAID" | "CANCELLED";
  agreementNotes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SaleCreationAttributes
  extends Optional<
    SaleAttributes,
    "id" | "status" | "agreementNotes" | "createdAt" | "updatedAt"
  > {}

class Sale
  extends Model<SaleAttributes, SaleCreationAttributes>
  implements SaleAttributes
{
  public id!: number;
  public valueTotal!: number;
  public description!: string;
  public userId!: number;
  public status!: "NEGOTIATING" | "CONFIRMED" | "PAID" | "CANCELLED";
  public agreementNotes!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Sale.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    valueTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "NEGOTIATING",
        "CONFIRMED",
        "PAID",
        "CANCELLED"
      ),
      allowNull: false,
      defaultValue: "NEGOTIATING",
    },
    agreementNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "sales",
    timestamps: true,
  }
);

export default Sale;