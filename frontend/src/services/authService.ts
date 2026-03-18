import apiClient from "../api/client"

import type { LoginRequest, LoginResponse } from "../types/auth"

export const authService = {
  
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post("/auth/login", data)

    const { token } = response.data

    localStorage.setItem("token", token)

    return response.data
  },

  logout() {
    localStorage.removeItem("token")
  },

  getToken(): string | null {
    return localStorage.getItem("token")
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token")
  },
}