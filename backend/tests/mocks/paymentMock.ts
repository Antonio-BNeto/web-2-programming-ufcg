import { PaymentRequest } from "@/dto/payment/PaymentRequest.dto";
import { PaymentResponse } from "@/dto/payment/PaymentResponse.dto";

// Mock da requisição (Input)
export const mockPaymentRequest: PaymentRequest = {
  saleId: 50,
  paymentMethodId: 5,
  value: 150.50
};

// Mock da resposta (Output)
export const mockPaymentResponse: PaymentResponse = {
  id: 1,
  saleId: 50,
  paymentMethodId: 5,
  value: 150.50,
  status: "PAID",
  paymentDate: new Date("2026-02-27T12:00:00.000Z"),
  sale: {
    id: 50,
    userId: 1,
    description: "Venda de periféricos gamer",
    valueTotal: 250.50
  }
};

/**
 * Mock para simular o objeto que sai do Sequelize
 * Inclui o toJSON para o TSOA/Express processar corretamente
 */
export const mockPaymentModel = {
  ...mockPaymentResponse,
  toJSON: () => ({
    ...mockPaymentResponse,
    paymentDate: mockPaymentResponse.paymentDate.toISOString()
  })
};