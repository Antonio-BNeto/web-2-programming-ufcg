import request from 'supertest';
import app from '@/app';
import PaymentMethodService from '@/services/PaymentMethodService';
import { generateTestToken } from '../helpers/auth';
import { mockPixMethodResponse, mockBankMethodResponse } from '../mocks'; // Import simples

describe('PaymentMethod Integration', () => {
  const token = generateTestToken(1);

  it('deve listar métodos PIX do usuário', async () => {
    jest.spyOn(PaymentMethodService, 'getUserPaymentMethods').mockResolvedValue([
      mockPixMethodResponse as any
    ]);

    const response = await request(app)
      .get('/payment-methods')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body[0].Pix.key).toBe("neto@ufcg.edu.br");
  });

  it('deve validar criação de conta bancária', async () => {
    jest.spyOn(PaymentMethodService, 'createPaymentMethod').mockResolvedValue(
      mockBankMethodResponse as any
    );

    const response = await request(app)
      .post('/payment-methods')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: "BANK_ACCOUNT", data: { bank_name: "BB" } });

    expect(response.status).toBe(201);
    expect(response.body.BankAccount.bank_name).toBe("Banco do Brasil");
  });
});