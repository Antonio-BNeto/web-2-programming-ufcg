export interface ItemRequest {
  /** @example "Teclado Mecânico" */
  name: string;

  /** @example "Teclado RGB switch blue" */
  description: string;

  /** @example 250.50 */
  price: number;

  /** @example 10 */
  quantity: number;
}