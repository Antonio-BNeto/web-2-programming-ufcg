import apiClient from "../api/client"

import type {
  CreatePaymentDTO,
  PaymentResponseDTO,
} from "../types/payment"

import type {
  PaginatedResponse,
} from "../types/common"

export const paymentService = {

  async create(data: CreatePaymentDTO): Promise<PaymentResponseDTO> {
    const response = await apiClient.post("/payments", data)
    return response.data
  },


  async getAll(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<PaymentResponseDTO>> {
    const response = await apiClient.get("/payments", {
      params: { page, limit },
    })
    return response.data
  },


  async getById(id: number): Promise<PaymentResponseDTO> {
    const response = await apiClient.get(`/payments/${id}`)
    return response.data
  },


  async delete(id: number): Promise<void> {
    await apiClient.delete(`/payments/${id}`)
  },
}