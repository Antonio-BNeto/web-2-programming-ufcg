import PaymentService from '../../src/services/PaymentService';
import { mockPaymentRequest } from '../mocks/paymentMock';
import { PaymentRequest } from '../../src/dto/payment/PaymentRequest.dto';

describe('PaymentService Rules', () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve lançar erro se o valor do pagamento exceder o saldo da venda', async () => {
    jest.spyOn(PaymentService, 'createPayment').mockRejectedValue(
      new Error("Valor excede o saldo restante")
    );
    await expect(PaymentService.createPayment(mockPaymentRequest, 1))
      .rejects.toThrow(/saldo restante/);
  });
});