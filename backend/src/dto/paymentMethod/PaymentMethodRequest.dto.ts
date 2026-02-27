export interface PixData {
  key: string;
}

export interface CardData {
  holder_name: string;
  card_number: string;
  expiration_month: number;
  expiration_year: number;
  cvv: string;
}

export interface BankAccountData {
  bank_name: string;
  agency: string;
  account_number: string;
  account_type: string;
}

export interface CreatePaymentMethodRequest {
  type: "PIX" | "CARD" | "BANK_ACCOUNT";
  pix?: PixData;
  card?: CardData;
  bankAccount?: BankAccountData;
}