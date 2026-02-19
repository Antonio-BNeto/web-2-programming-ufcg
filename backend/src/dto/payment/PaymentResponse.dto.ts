import { PaymentRequest } from "./PaymentRequest.dto";

export class PaymentResponse extends PaymentRequest {
  /** @example 1 */
  id!: number;
}