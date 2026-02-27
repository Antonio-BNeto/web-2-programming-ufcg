import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export type UserRole = "USER" | "ADMIN";

export interface UserAttributes {
    id: number;
    cpf: string;
    phoneNumber: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface UserCreationAttributes
    extends Optional<UserAttributes, "id" | "role"> {}

class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes
{
    public id!: number;
    public cpf!: string;
    public phoneNumber!: string;
    public name!: string;
    public email!: string;
    public password!: string;
    public role!: UserRole;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        cpf: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("USER", "ADMIN"),
            allowNull: false,
            defaultValue: "USER",
        },
    },
    {
        sequelize,
        tableName: "users",
        timestamps: false,
    }
);

export default User;