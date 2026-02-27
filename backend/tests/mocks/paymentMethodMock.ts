import PaymentMethod from "@/models/PaymentMethod";

// Mock para resposta de PIX
export const mockPixMethodResponse = {
  id: 1,
  userId: 1,
  type: "PIX" as const,
  main: true,
  Pix: {
    id: 1,
    payment_method_id: 1,
    key: "neto@ufcg.edu.br"
  }
};

// Mock para resposta de Cartão
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

// Mock para resposta de Conta Bancária
export const mockBankMethodResponse = {
  id: 3,
  userId: 1,
  type: "BANK_ACCOUNT" as const,
  main: false,
  BankAccount: {
    id: 1,
    payment_method_id: 3,
    bank_name: "Banco do Brasil",
    agency: "1234-5",
    account_number: "00012345-6",
    account_type: "CORRENTE"
  }
};

/**
 * Helper para os testes de Service/Controller
 * Retorna o mock completo com o método toJSON simulado
 */
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