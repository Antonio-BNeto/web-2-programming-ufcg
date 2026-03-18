export interface CreateSaleDTO {
  itemId: number
  quantity: number
}

export interface SaleResponseDTO {
  id: number
  itemId: number
  quantity: number
  totalPrice: number
  createdAt: string
}