import apiClient from "../api/client"

import type {
  CreateUserDTO,
  UpdateUserDTO,
  UserResponseDTO,
} from "../types/User"

import type {
  PaginatedResponse,
  MessageResponse,
} from "../types/common"

export const userService = {
  async create(data: CreateUserDTO): Promise<UserResponseDTO> {
    const response = await apiClient.post("/users", data)
    return response.data
  },

  async getAll(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<UserResponseDTO>> {
    const response = await apiClient.get("/users", {
      params: { page, limit },
    })
    return response.data
  },

  async getById(id: number): Promise<UserResponseDTO> {
    const response = await apiClient.get(`/users/${id}`)
    return response.data
  },

  async update(
    id: number,
    data: UpdateUserDTO
  ): Promise<UserResponseDTO> {
    const response = await apiClient.put(`/users/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<MessageResponse> {
    const response = await apiClient.delete(`/users/${id}`)
    return response.data
  },
}