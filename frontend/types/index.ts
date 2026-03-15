export type Role = 'USER' | 'ADMIN';
export type SaleStatus = 'NEGOTIATING' | 'CONFIRMED' | 'PAID' | 'CANCELLED';
export type PaymentStatus = 'PAID' | 'PENDING' | 'CANCELLED';
export type PaymentMethodType = 'PIX' | 'CARD' | 'BANK_ACCOUNT';

export interface User {
  id: number;
  cpf: string;
  phoneNumber: string;
  name: string;
  email: string;
  role: Role;
}

export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  userId?: number;
}

export interface SaleItemDetail {
  id: number;
  saleId: number;
  itemId: number;
  quantity: number;
  unitPrice: number;
  Item?: Item;
}

export interface Sale {
  id: number;
  valueTotal: number;
  description: string;
  userId: number;
  status: SaleStatus;
  agreementNotes?: string;
  createdAt: string;
  updatedAt: string;
  SaleItems?: SaleItemDetail[];
}

export interface Payment {
  id: number;
  saleId: number;
  paymentMethodId: number;
  value: number;
  status: PaymentStatus;
  paymentDate: string;
  sale?: Sale;
}

export interface PixDetail {
  key: string;
}

export interface CardDetail {
  holder_name: string;
  card_number: string;
  expiration_month: number;
  expiration_year: number;
}

export interface BankAccountDetail {
  bank_name: string;
  agency: string;
  account_number: string;
  account_type: string;
}

export interface PaymentMethod {
  id: number;
  userId: number;
  type: PaymentMethodType;
  main: boolean;
  Pix?: PixDetail;
  Card?: CardDetail;
  BankAccount?: BankAccountDetail;
}

export interface PaginatedResponse<T> {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: T[];
}

export interface AuthResponse {
  message: string;
  token: string;
}

export interface MessageResponse {
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateUserRequest {
  cpf: string;
  phoneNumber: string;
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  phoneNumber?: string;
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
}

export interface CreateItemRequest {
  name: string;
  description: string;
  price: number;
  quantity: number;
}

export interface UpdateItemRequest {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
}

export interface SaleItemRequest {
  itemId: number;
  quantity: number;
}

export interface CreateSaleRequest {
  description: string;
  items: SaleItemRequest[];
}

export interface UpdateSaleRequest {
  description?: string;
  status?: SaleStatus;
  agreementNotes?: string;
}

export interface CreatePaymentRequest {
  saleId: number;
  paymentMethodId: number;
  value: number;
}

export interface CreatePaymentMethodRequest {
  type: PaymentMethodType;
  pix?: { key: string };
  card?: {
    holder_name: string;
    card_number: string;
    expiration_month: number;
    expiration_year: number;
    cvv: string;
  };
  bankAccount?: {
    bank_name: string;
    agency: string;
    account_number: string;
    account_type: string;
  };
}
