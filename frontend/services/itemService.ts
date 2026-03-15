import { api } from './api';
import { Item, CreateItemRequest, UpdateItemRequest, PaginatedResponse, MessageResponse } from '@/types';

export const itemService = {
  create: (data: CreateItemRequest) => api.post<Item>('/items', data),
  list: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<Item>>(`/items?page=${page}&limit=${limit}`),
  getById: (id: number) => api.get<Item>(`/items/${id}`),
  update: (id: number, data: UpdateItemRequest) => api.put<Item>(`/items/${id}`, data),
  delete: (id: number) => api.delete<MessageResponse>(`/items/${id}`),
};
