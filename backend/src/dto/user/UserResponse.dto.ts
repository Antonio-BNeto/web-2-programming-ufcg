export interface UserResponseDTO {
  id: number;
  cpf: string;
  phoneNumber: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}