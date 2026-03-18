export interface ErrorResponse {
  message: string
}

export interface PaginatedResponse<T> {
  totalItems: number
  totalPages: number
  currentPage: number
  items: T[]
}

export interface MessageResponse {
  message: string
}