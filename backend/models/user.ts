import {Model, DataTypes, Optional} from 'sequelize';
import sequelize from '../config/database';

export interface UserAttributes {
    cpf: number;
    
    
}