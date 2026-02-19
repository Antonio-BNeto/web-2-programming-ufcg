import { SaleResponse } from "./SaleResponse.dto";

export class SaleItemDetail {
  /** @example 1 */
  id!: number;
  /** @example "Teclado Mecânico" */
  name!: string;
  /** @example 150.0 */
  price!: number;

  SaleItem!: {
    quantity: number;
    unitPrice: number;
  };
}

export interface SaleDetailResponse extends SaleResponse {
  vendedor?: { name: string; email: string };
  itens?: any[];
}