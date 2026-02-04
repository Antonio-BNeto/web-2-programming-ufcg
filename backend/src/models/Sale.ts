import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./User";

export interface SaleAttributes {
    id: number;
    valueTotal: number;
    description: string;
    userId: number;
}

export interface SaleCreationAttributes
    extends Optional<SaleAttributes, "id"> {}

export class Sale
    extends Model<SaleAttributes, SaleCreationAttributes>
    implements SaleAttributes
{
    public id!: number;
    public valueTotal!: number;
    public description!: string;
    public userId!: number;
}

Sale.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        valueTotal: {
            type: DataTypes.FLOAT,
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
    },
    {
        sequelize,
        tableName: "sales",
        timestamps: false,
    }
);

export default Sale;