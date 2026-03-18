export interface CreateItemDTO {
  name: string
  price: number
  stock: number
}

export interface UpdateItemDTO {
  name?: string
  price?: number
  stock?: number
}

export interface ItemResponseDTO {
  id: number
  name: string
  price: number
  stock: number
}