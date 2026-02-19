import User from "./User";
import Sale from "./Sale";
import Item from "./Item";
import Payment from "./Payment";
import PaymentMethod from "./PaymentMethod";
import Pix from "./Pix";
import BankAccount from "./BankAccount";
import Card from "./Card";
import SaleItem from "./SaleItem";

import { setupAssociations } from "./associations";

setupAssociations();

export {
  User,
  Sale,
  Item,
  Payment,
  PaymentMethod,
  Pix,
  BankAccount,
  Card,
  SaleItem,
};