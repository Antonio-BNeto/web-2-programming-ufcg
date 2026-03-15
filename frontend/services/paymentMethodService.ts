import { api } from './api';
import { PaymentMethod, CreatePaymentMethodRequest, MessageResponse } from '@/types';

export const paymentMethodService = {
  list: () => api.get<PaymentMethod[]>('/payment-methods'),
  getById: (id: number) => api.get<PaymentMethod>(`/payment-methods/${id}`),
  create: (data: CreatePaymentMethodRequest) =>
    api.post<PaymentMethod>('/payment-methods', data),
  delete: (id: number) => api.delete<MessageResponse>(`/payment-methods/${id}`),
};
