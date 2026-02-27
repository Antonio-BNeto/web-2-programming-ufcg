export interface PaymentMethodResponse {
  id: number;
  userId: number;
  type: "PIX" | "CARD" | "BANK_ACCOUNT";
  main: boolean;
  Pix?: { key: string };
  Card?: {
    holder_name: string;
    card_number: string;
    expiration_month: number;
    expiration_year: number;
  };
  BankAccount?: {
    bank_name: string;
    agency: string;
    account_number: string;
    account_type: string;
  };
}