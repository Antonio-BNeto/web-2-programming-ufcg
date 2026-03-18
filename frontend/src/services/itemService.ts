import apiClient from "../api/client"

import type {
  CreateItemDTO,
  UpdateItemDTO,
  ItemResponseDTO,
} from "../types/item"

import type {
  PaginatedResponse,
  MessageResponse,
} from "../types/common"

export const itemService = {

  async create(data: CreateItemDTO): Promise<ItemResponseDTO> {
    const response = await apiClient.post("/items", data)
    return response.data
  },


  async getAll(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<ItemResponseDTO>> {
    const response = await apiClient.get("/items", {
      params: { page, limit },
    })
    return response.data
  },


  async getById(id: number): Promise<ItemResponseDTO> {
    const response = await apiClient.get(`/items/${id}`)
    return response.data
  },


  async update(
    id: number,
    data: UpdateItemDTO
  ): Promise<ItemResponseDTO> {
    const response = await apiClient.put(`/items/${id}`, data)
    return response.data
  },


  async delete(id: number): Promise<MessageResponse> {
    const response = await apiClient.delete(`/items/${id}`)
    return response.data
  },
}