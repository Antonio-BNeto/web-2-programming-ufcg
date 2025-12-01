import {Model, DataTypes, Optional} from 'sequelize';
import sequelize from '../config/database';

export interface UserAttributes {
    id: number;
    cpf: string;
    phoneNumber: string;
    name: string;
    email: string;
    password: string;
}

export interface UserCreationAttributes
    extends Optional<UserAttributes, "id"> {}

export class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes
{
    public id!: number;
    public cpf!: string;
    public phoneNumber!: string;
    public name!: string;
    public email!: string;
    public password!: string;
}


User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        cpf: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: "users",
        timestamps: false
    }
)