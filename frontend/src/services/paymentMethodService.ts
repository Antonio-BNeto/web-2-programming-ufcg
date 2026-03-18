import apiClient from "../api/client"

import type {
  CreatePaymentMethodDTO,
  UpdatePaymentMethodDTO,
  PaymentMethodResponseDTO,
} from "../types/paymentMethod"

import type {
  PaginatedResponse,
} from "../types/common"

export const paymentMethodService = {

  async create(data: CreatePaymentMethodDTO): Promise<PaymentMethodResponseDTO> {
    const response = await apiClient.post("/payment-methods", data)
    return response.data
  },


  async getAll(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<PaymentMethodResponseDTO>> {
    const response = await apiClient.get("/payment-methods", {
      params: { page, limit },
    })
    return response.data
  },


  async getById(id: number): Promise<PaymentMethodResponseDTO> {
    const response = await apiClient.get(`/payment-methods/${id}`)
    return response.data
  },


  async update(
    id: number,
    data: UpdatePaymentMethodDTO
  ): Promise<PaymentMethodResponseDTO> {
    const response = await apiClient.put(`/payment-methods/${id}`, data)
    return response.data
  },


  async delete(id: number): Promise<void> {
    await apiClient.delete(`/payment-methods/${id}`)
  },
}