export class SaleUpdateRequest {
  /** @example "Nova descrição da venda" */
  description?: string;

  /**
   * Status da venda
   * @example "CONFIRMED"
   */
  status?: "NEGOTIATING" | "CONFIRMED" | "PAID" | "CANCELLED";
}