import { api } from './api';
import { User, CreateUserRequest, UpdateUserRequest, PaginatedResponse, MessageResponse } from '@/types';

export const userService = {
  create: (data: CreateUserRequest) => api.post<User>('/users', data),
  list: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<User>>(`/users?page=${page}&limit=${limit}`),
  getById: (id: number) => api.get<User>(`/users/${id}`),
  update: (id: number, data: UpdateUserRequest) => api.put<User>(`/users/${id}`, data),
  delete: (id: number) => api.delete<MessageResponse>(`/users/${id}`),
};
