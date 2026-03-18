export interface CreateUserDTO {
  cpf: string
  phoneNumber: string
  name: string
  email: string
  password: string
}

export interface UpdateUserDTO {
  phoneNumber?: string
  name?: string
  email?: string
  password?: string
  role?: "USER" | "ADMIN"
}

export interface UserResponseDTO {
  id: number
  cpf: string
  phoneNumber: string
  name: string
  email: string
  role: "USER" | "ADMIN"
}