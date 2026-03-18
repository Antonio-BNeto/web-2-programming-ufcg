export interface CreatePaymentDTO {
  saleId: number
  paymentMethodId: number
  amount: number
}

export interface PaymentResponseDTO {
  id: number
  saleId: number
  paymentMethodId: number
  amount: number
  createdAt: string
}