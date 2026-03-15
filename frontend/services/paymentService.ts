import { api } from './api';
import { Payment, CreatePaymentRequest, PaginatedResponse, MessageResponse } from '@/types';

export const paymentService = {
  list: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<Payment>>(`/payments?page=${page}&limit=${limit}`),
  getById: (id: number) => api.get<Payment>(`/payments/${id}`),
  create: (data: CreatePaymentRequest) => api.post<Payment>('/payments', data),
  delete: (id: number) => api.delete<MessageResponse>(`/payments/${id}`),
};
