import User from "./User";
import Sale from "./Sale";
import Item from "./Item";
import Payment from "./Payment";
import SaleItem from "./SaleItem";
import PaymentMethod from "./PaymentMethod";
import Pix from "./Pix";
import Card from "./Card";
import BankAccount from "./BankAccount";

export const setupAssociations = () => {

  User.hasMany(Sale, {
    foreignKey: "userId",
    as: "sales",
  });

  Sale.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  Sale.hasMany(Payment, {
    foreignKey: "saleId",
    as: "payments",
  });

  Payment.belongsTo(Sale, {
    foreignKey: "saleId",
    as: "parentSale",
  });



  Sale.belongsToMany(Item, {
    through: SaleItem,
    foreignKey: "saleId",
    otherKey: "itemId",
    as: "items",
  });

  User.hasMany(Item, {
    foreignKey: "userId",
    as: "items",
  });

  Item.belongsTo(User, {
    foreignKey: "userId",
    as: "owner",
  });

  Item.belongsToMany(Sale, {
    through: SaleItem,
    foreignKey: "itemId",
    otherKey: "saleId",
    as: "sales",
  });


  Sale.hasMany(SaleItem, {
    foreignKey: "saleId",
    as: "saleItems",
  });

  SaleItem.belongsTo(Sale, {
    foreignKey: "saleId",
    as: "saleReference",
  });


  Item.hasMany(SaleItem, {
    foreignKey: "itemId",
    as: "saleItems",
  });

  SaleItem.belongsTo(Item, {
    foreignKey: "itemId",
    as: "item",
  });


  User.hasMany(PaymentMethod, {
    foreignKey: "userId",
    as: "paymentMethods",
  });

  PaymentMethod.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });


  PaymentMethod.hasMany(Payment, {
    foreignKey: "paymentMethodId",
    as: "payments",
  });

  Payment.belongsTo(PaymentMethod, {
    foreignKey: "paymentMethodId",
    as: "paymentMethod",
  });

  PaymentMethod.hasOne(Pix, {
    foreignKey: "payment_method_id",
    as: "Pix",
  });

  Pix.belongsTo(PaymentMethod, {
    foreignKey: "payment_method_id",
    as: "paymentMethod",
  });

  PaymentMethod.hasOne(Card, {
    foreignKey: "payment_method_id",
    as: "Card",
  });

  Card.belongsTo(PaymentMethod, {
    foreignKey: "payment_method_id",
    as: "paymentMethod",
  });

  PaymentMethod.hasOne(BankAccount, {
    foreignKey: "payment_method_id",
    as: "BankAccount",
  });

  BankAccount.belongsTo(PaymentMethod, {
    foreignKey: "payment_method_id",
    as: "paymentMethod",
  });

};