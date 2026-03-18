import apiClient from "../api/client"

import type {
  CreateSaleDTO,
  SaleResponseDTO,
} from "../types/sale"

import type {
  PaginatedResponse,
} from "../types/common"

export const saleService = {

  async create(data: CreateSaleDTO): Promise<SaleResponseDTO> {
    const response = await apiClient.post("/sales", data)
    return response.data
  },


  async getAll(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<SaleResponseDTO>> {
    const response = await apiClient.get("/sales", {
      params: { page, limit },
    })
    return response.data
  },


  async getById(id: number): Promise<SaleResponseDTO> {
    const response = await apiClient.get(`/sales/${id}`)
    return response.data
  },


  async delete(id: number): Promise<void> {
    await apiClient.delete(`/sales/${id}`)
  },
}