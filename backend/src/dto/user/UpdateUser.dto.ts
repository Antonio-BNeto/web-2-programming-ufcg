export interface UpdateUserDTO {
  phoneNumber?: string;
  name?: string;
  email?: string;
  password?: string;
  role?: "USER" | "ADMIN";
}