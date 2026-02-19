import { SaleItemRequest } from "./SaleItem.dto";

export class SaleCreateRequest {
  /** @example "Venda de periféricos gamer" */
  description!: string;

  /** @example [{ "itemId": 1, "quantity": 2 }] */
  items!: SaleItemRequest[];
}