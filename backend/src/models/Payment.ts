import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export interface PaymentAttributes {
    id: number;
    saleId: number;
    status: string;
    paymentDate: Date | null;
    value: number;
}

export interface PaymentCreationAttributes
    extends Optional<PaymentAttributes, "id" | "paymentDate"> {}

export class Payment
    extends Model<PaymentAttributes, PaymentCreationAttributes>
    implements PaymentAttributes
{
    public id!: number;
    public saleId!: number;
    public status!: string;
    public paymentDate!: Date | null;
    public value!: number;
}

Payment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        saleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "sale_id"
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        paymentDate: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "payment_date"
        },
        value: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: "payments",
        timestamps: false
    }
);
