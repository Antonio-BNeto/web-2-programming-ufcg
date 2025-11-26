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
    public name!: string;
    public cpf!: string;
    public phoneNumber!: string;
    public email!: string;
    public password!: string;
}

User.init(
    {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type:DataTypes.STRING,
            allowNull: false
        },
        cpf: {
            type:DataTypes.STRING,
            allowNull: false
        },
        phoneNumber: {
            type:DataTypes.STRING,
        },
        email: {
            type:DataTypes.STRING,
            allowNull: false
        },
        password: {
            type:DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "users",
        timestamps: false
    }
)