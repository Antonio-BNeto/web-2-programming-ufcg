import User from "./User";
import Sale from "./Sale";
import Item from "./Item";
import Payment from "./Payment";
import SaleItem from "./SaleItem";
import PaymentMethod from "./PaymentMethod";

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

};