import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface ItemAttributes {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
}

export interface ItemCreationAttributes
    extends Optional<ItemAttributes, "id"> {}

class Item
    extends Model<ItemAttributes, ItemCreationAttributes>
    implements ItemAttributes
{
    public id!: number;
    public name!: string;
    public description!: string;
    public price!: number;
    public quantity!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Item.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: "Item",
        tableName: "items",
        timestamps: true,
    }
);

export default Item;