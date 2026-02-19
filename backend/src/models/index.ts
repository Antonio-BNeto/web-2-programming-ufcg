import User from "./User";
import Item from "./Item";
import Sale from "./Sale";
import Payment from "./Payment";
import PaymentMethod from "./PaymentMethod";
import Pix from "./Pix";
import BankAccount from "./BankAccount";
import Card from "./Card";
import SaleItem from "./SaleItem";


export const setupAssociations = () => {
  // User → Sale (1:N)
  User.hasMany(Sale, {
    foreignKey: "user_id",
    as: "sales",
  });

  Sale.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });

  // User → PaymentMethod (1:N)
  User.hasMany(PaymentMethod, {
    foreignKey: "user_id",
    as: "paymentMethods",
  });

  PaymentMethod.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });

  // Sale ↔ Item (N:N)
  Sale.belongsToMany(Item, {
    through: SaleItem,
    foreignKey: "sale_id",
    otherKey: "item_id",
    as: "items",
  });

  Item.belongsToMany(Sale, {
    through: SaleItem,
    foreignKey: "item_id",
    otherKey: "sale_id",
    as: "sales",
  });

  // Sale → Payment (1:N)
  Sale.hasMany(Payment, {
    foreignKey: "sale_id",
    as: "payments",
  });

  Payment.belongsTo(Sale, {
    foreignKey: "sale_id",
    as: "sale",
  });

  // PaymentMethod → Payment (1:N)
  PaymentMethod.hasMany(Payment, {
    foreignKey: "payment_method_id",
    as: "payments",
  });

  Payment.belongsTo(PaymentMethod, {
    foreignKey: "payment_method_id",
    as: "paymentMethod",
  });

  // Especializações de PaymentMethod (1:1)
  // Pix
  PaymentMethod.hasOne(Pix, {
    foreignKey: "payment_method_id",
    as: "pix",
    onDelete: "CASCADE",
  });
  Pix.belongsTo(PaymentMethod, {
    foreignKey: "payment_method_id",
    as: "paymentMethod",
  });

  // Bank Account
  PaymentMethod.hasOne(BankAccount, {
    foreignKey: "payment_method_id",
    as: "bankAccount",
    onDelete: "CASCADE",
  });
  BankAccount.belongsTo(PaymentMethod, {
    foreignKey: "payment_method_id",
    as: "paymentMethod",
  });

  // Card
  PaymentMethod.hasOne(Card, {
    foreignKey: "payment_method_id",
    as: "card",
    onDelete: "CASCADE",
  });
  Card.belongsTo(PaymentMethod, {
    foreignKey: "payment_method_id",
    as: "paymentMethod",
  });
};

export {
  User,
  Item,
  Sale,
  Payment,
  PaymentMethod,
  Pix,
  BankAccount,
  Card,
  SaleItem,
};