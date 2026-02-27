import { UserResponseDTO } from "../../src/dto/user";

export const mockUserResponse: UserResponseDTO = {
  id: 1,
  cpf: "12345678900",
  phoneNumber: "83999999999",
  name: "Antonio Neto",
  email: "neto@gmail.com",
  role: 'USER'
};

export const mockUserModel = {
  ...mockUserResponse,
  password: "hashed_password",
  toJSON: () => mockUserResponse
};