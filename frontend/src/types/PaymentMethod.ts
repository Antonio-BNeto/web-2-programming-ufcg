export interface CreatePaymentMethodDTO {
  name: string
}

export interface UpdatePaymentMethodDTO {
  name?: string
}

export interface PaymentMethodResponseDTO {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}