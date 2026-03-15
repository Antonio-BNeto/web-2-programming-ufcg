import { api } from './api';
import { AuthResponse, LoginRequest } from '@/types';

export const authService = {
  login: (data: LoginRequest) => api.post<AuthResponse>('/auth/login', data),
};
