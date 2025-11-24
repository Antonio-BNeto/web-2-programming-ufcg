import {Model, DataTypes, Optional} from 'sequelize';
import sequelize from '../config/database';

export interface UserAttributes {
    cpf: string;
    phoneNumber: string;
    email: string;
    password: string;
}

export interface UserCreationAttributes
    extends Optional<UserAttributes, "cpf"> {}

export class User
    extends Model<UserAttributes, UserCreationAttributes> 
    implements UserAttributes 
{
    public cpf!: string;
    public phoneNumber!: string;
    public email!: string;
    public password!: string;
}



