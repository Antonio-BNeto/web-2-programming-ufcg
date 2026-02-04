import { Example } from "tsoa";

export class SaleItemRequest {
  /** @example 1 */
  itemId!: number;

  /** @example 2 */
  quantity!: number;
}

export class SaleCreateRequest {
  /** @example "Venda de periféricos gamer" */
  description!: string;

  /** @example [{ "itemId": 1, "quantity": 2 }] */
  items!: SaleItemRequest[];
}

export class SaleUpdateRequest {
  /** @example "Nova descrição da venda" */
  description?: string;
}
