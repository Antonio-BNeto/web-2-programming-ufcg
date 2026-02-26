export class PaymentSaleResponse {
  /** @example 1 */
  id!: number;

  /** @example 1 */
  userId!: number;

  /** @example "Venda de periféricos gamer" */
  description!: string;

  /** @example 250.50 */
  valueTotal!: number;
}

export class PaymentResponse {
  /** @example 1 */
  id!: number;

  /** @example 1 */
  saleId!: number;

  /** @example 1 */
  paymentMethodId!: number;

  /** @example 150.50 */
  value!: number;

  /** @example "PAID" */
  status!: string;

  /** @example "2026-02-26T12:00:00.000Z" */
  paymentDate!: Date;

  sale?: PaymentSaleResponse;
}