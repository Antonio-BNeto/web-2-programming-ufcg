export const mockPixMethodResponse = {
  id: 1,
  userId: 1,
  type: "PIX" as const,
  main: true,
  Pix: {
    id: 1,
    payment_method_id: 1,
    key: "neto@gmail.com"
  }
};

export const mockCardMethodResponse = {
  id: 2,
  userId: 1,
  type: "CARD" as const,
  main: false,
  Card: {
    id: 1,
    payment_method_id: 2,
    holder_name: "Antonio Barros",
    card_number: "**** **** **** 1234",
    expiration_month: 12,
    expiration_year: 2030,
    cvv: "***"
  }
};

export const mockBankMethodResponse = {
  id: 2,
  userId: 1,
  type: "BANK_ACCOUNT",
  main: false,
  BankAccount: {
    bank_name: "Banco do Brasil",
    agency: "0001",
    account_number: "123456-7",
    account_type: "corrente"
  }
};

export const mockPaymentMethodModel = (type: "PIX" | "CARD" | "BANK_ACCOUNT" = "PIX") => {
  const dataMap = {
    PIX: mockPixMethodResponse,
    CARD: mockCardMethodResponse,
    BANK_ACCOUNT: mockBankMethodResponse
  };
  
  const data = dataMap[type];
  
  return {
    ...data,
    toJSON: () => data
  };
};