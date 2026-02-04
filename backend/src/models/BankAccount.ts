import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export interface BankAccountAttributes {
  id: number;
  payment_method_id: number;
  bank_name: string;
  agency: string;
  account_number: string;
  account_type: string;
}

export interface BankAccountCreationAttributes
  extends Optional<BankAccountAttributes, "id"> {}

class BankAccount
  extends Model<BankAccountAttributes, BankAccountCreationAttributes>
  implements BankAccountAttributes
{
  public id!: number;
  public payment_method_id!: number;
  public bank_name!: string;
  public agency!: string;
  public account_number!: string;
  public account_type!: string;
}

BankAccount.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    payment_method_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    bank_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    agency: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    account_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    account_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "bank_accounts",
    timestamps: false,
  }
);

export default BankAccount;
