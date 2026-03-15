import { api } from './api';
import { Sale, CreateSaleRequest, UpdateSaleRequest, PaginatedResponse } from '@/types';

export const saleService = {
  create: (data: CreateSaleRequest) => api.post<Sale>('/sales', data),
  listMy: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<Sale>>(`/sales?page=${page}&limit=${limit}`),
  listAll: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<Sale>>(`/sales/admin/all?page=${page}&limit=${limit}`),
  getById: (id: number) => api.get<Sale>(`/sales/${id}`),
  listByUser: (userId: number, page = 1, limit = 10) =>
    api.get<PaginatedResponse<Sale>>(`/sales/user/${userId}?page=${page}&limit=${limit}`),
  update: (id: number, data: UpdateSaleRequest) => api.put<Sale>(`/sales/${id}`, data),
};
