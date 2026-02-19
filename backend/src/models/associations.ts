import User from "./User";
import Sale from "./Sale";
import Item from "./Item";
import Payment from "./Payment";
import SaleItem from "./SaleItem";
import PaymentMethod from "./PaymentMethod";

export const setupAssociations = () => {

  /**
   * =========================
   * USER ↔ SALE (1:N)
   * =========================
   */
  User.hasMany(Sale, {
    foreignKey: "userId",
    as: "sales",
  });

  Sale.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });


  /**
   * =========================
   * SALE ↔ PAYMENT (1:N)
   * =========================
   */
  Sale.hasMany(Payment, {
    foreignKey: "saleId",
    as: "payments",
  });

  Payment.belongsTo(Sale, {
    foreignKey: "saleId",
    as: "sale",
  });


  /**
   * =========================
   * SALE ↔ ITEM (N:N)
   * Through: SaleItem
   * =========================
   */
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


  /**
   * =========================
   * SALE ↔ SALE_ITEM (1:N)
   * =========================
   */
  Sale.hasMany(SaleItem, {
    foreignKey: "saleId",
    as: "saleItems",
  });

  SaleItem.belongsTo(Sale, {
    foreignKey: "saleId",
    as: "sale",
  });


  /**
   * =========================
   * ITEM ↔ SALE_ITEM (1:N)
   * =========================
   */
  Item.hasMany(SaleItem, {
    foreignKey: "itemId",
    as: "saleItems",
  });

  SaleItem.belongsTo(Item, {
    foreignKey: "itemId",
    as: "item",
  });


  /**
   * =========================
   * USER ↔ PAYMENT METHOD (1:N)
   * =========================
   */
  User.hasMany(PaymentMethod, {
    foreignKey: "userId",
    as: "paymentMethods",
  });

  PaymentMethod.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });


  /**
   * =========================
   * PAYMENT METHOD ↔ PAYMENT (1:N)
   * =========================
   */
  PaymentMethod.hasMany(Payment, {
    foreignKey: "paymentMethodId",
    as: "payments",
  });

  Payment.belongsTo(PaymentMethod, {
    foreignKey: "paymentMethodId",
    as: "paymentMethod",
  });

};