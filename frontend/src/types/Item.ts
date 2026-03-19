export interface CreateItemDTO {
  name: string
  description: string
  price: number
  quantity?: number
}

export interface UpdateItemDTO {
  name?: string
  description?: string
  price?: number
  quantity?: number
}

export interface ItemResponseDTO {
  id: number
  name: string
  description: string
  price: number
  quantity: number
}