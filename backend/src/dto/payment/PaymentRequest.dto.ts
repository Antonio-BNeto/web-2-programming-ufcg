export class PaymentRequest {
  /** @example 1 */
  saleId!: number;
  /** @example 1 */
  paymentMethodId!: number;
  /** @example "PENDING" */
  status!: string;
  /** @example 150.50 */
  value!: number;
  /** @example "2026-02-03T23:00:00Z" */
  paymentDate?: Date | null;
}