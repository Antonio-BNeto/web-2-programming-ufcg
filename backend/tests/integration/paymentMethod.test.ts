import request from 'supertest';
import app from '@/app';
import PaymentMethodService from '../../src/services/PaymentMethodService';
import { AppError } from '@/errors/AppError';
import { generateTestToken } from '../helpers/auth';
import { mockPixMethodResponse, mockBankMethodResponse } from '../mocks';

jest.mock('../../src/services/PaymentMethodService');

const mockCardMethodResponse = {
  id: 3,
  userId: 1,
  type: 'CARD',
  Card: {
    holder_name: 'João Silva',
    card_number: '4111111111111111',
    expiration_month: 12,
    expiration_year: 2027,
    cvv: '123',
  },
};

describe('PaymentMethod Integration', () => {
  const token = generateTestToken(1);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /payment-methods', () => {
    it('deve listar métodos PIX do usuário', async () => {
      (PaymentMethodService.getUserPaymentMethods as jest.Mock).mockResolvedValue([
        mockPixMethodResponse as any,
      ]);

      const response = await request(app)
        .get('/payment-methods')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body[0].Pix.key).toBe('neto@gmail.com');
    });

    it('deve listar múltiplos métodos de pagamento', async () => {
      (PaymentMethodService.getUserPaymentMethods as jest.Mock).mockResolvedValue([
        mockPixMethodResponse as any,
        mockBankMethodResponse as any,
      ]);

      const response = await request(app)
        .get('/payment-methods')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it('deve retornar lista vazia quando usuário não tem métodos', async () => {
      (PaymentMethodService.getUserPaymentMethods as jest.Mock).mockResolvedValue([]);

      const response = await request(app)
        .get('/payment-methods')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });

    it('deve retornar 401 sem token', async () => {
      const response = await request(app).get('/payment-methods');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /payment-methods/:id', () => {
    it('deve retornar um método PIX por id', async () => {
      (PaymentMethodService.getPaymentMethodById as jest.Mock).mockResolvedValue(
        mockPixMethodResponse as any
      );

      const response = await request(app)
        .get('/payment-methods/1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.Pix.key).toBe('neto@gmail.com');
    });

    it('deve retornar 403 ao acessar método de outro usuário', async () => {
      (PaymentMethodService.getPaymentMethodById as jest.Mock).mockResolvedValue({
        ...mockPixMethodResponse,
        userId: 99,
      } as any);

      const response = await request(app)
        .get('/payment-methods/1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });

    it('deve retornar 404 para método inexistente', async () => {
      (PaymentMethodService.getPaymentMethodById as jest.Mock).mockRejectedValue(
        new AppError('Método de pagamento não encontrado.', 404)
      );

      const response = await request(app)
        .get('/payment-methods/999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it('deve retornar 401 sem token', async () => {
      const response = await request(app).get('/payment-methods/1');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /payment-methods', () => {
    describe('tipo PIX', () => {
      it('deve criar método PIX com sucesso', async () => {
        (PaymentMethodService.createPaymentMethod as jest.Mock).mockResolvedValue(
          mockPixMethodResponse as any
        );

        const response = await request(app)
          .post('/payment-methods')
          .set('Authorization', `Bearer ${token}`)
          .send({
            type: 'PIX',
            pix: { key: 'neto@gmail.com' },
          });

        expect(response.status).toBe(201);
        expect(response.body.Pix.key).toBe('neto@gmail.com');
      });

      it('deve retornar 400 sem chave PIX', async () => {
        (PaymentMethodService.createPaymentMethod as jest.Mock).mockRejectedValue(
          new AppError('Chave PIX é obrigatória.', 400)
        );

        const response = await request(app)
          .post('/payment-methods')
          .set('Authorization', `Bearer ${token}`)
          .send({ type: 'PIX', pix: {} });

        expect(response.status).toBe(400);
      });
    });

    describe('tipo BANK_ACCOUNT', () => {
      it('deve validar criação de conta bancária', async () => {
        (PaymentMethodService.createPaymentMethod as jest.Mock).mockResolvedValue(
          mockBankMethodResponse as any
        );

        const response = await request(app)
          .post('/payment-methods')
          .set('Authorization', `Bearer ${token}`)
          .send({
            type: 'BANK_ACCOUNT',
            bankAccount: {
              bank_name: 'Banco do Brasil',
              agency: '0001',
              account_number: '123456-7',
              account_type: 'corrente',
            },
          });

        expect(response.status).toBe(201);
        expect(response.body.BankAccount.bank_name).toBe('Banco do Brasil');
      });

      it('deve retornar 400 com dados bancários incompletos', async () => {
        (PaymentMethodService.createPaymentMethod as jest.Mock).mockRejectedValue(
          new AppError('Dados bancários incompletos.', 400)
        );

        const response = await request(app)
          .post('/payment-methods')
          .set('Authorization', `Bearer ${token}`)
          .send({
            type: 'BANK_ACCOUNT',
            bankAccount: { bank_name: 'Banco do Brasil' },
          });

        expect(response.status).toBe(400);
      });
    });

    describe('tipo CARD', () => {
      it('deve criar método de cartão com sucesso', async () => {
        (PaymentMethodService.createPaymentMethod as jest.Mock).mockResolvedValue(
          mockCardMethodResponse as any
        );

        const response = await request(app)
          .post('/payment-methods')
          .set('Authorization', `Bearer ${token}`)
          .send({
            type: 'CARD',
            card: {
              holder_name: 'João Silva',
              card_number: '4111111111111111',
              expiration_month: 12,
              expiration_year: 2027,
              cvv: '123',
            },
          });

        expect(response.status).toBe(201);
        expect(response.body.Card.holder_name).toBe('João Silva');
      });

      it('deve retornar 400 com dados do cartão incompletos', async () => {
        (PaymentMethodService.createPaymentMethod as jest.Mock).mockRejectedValue(
          new AppError('Dados do cartão incompletos.', 400)
        );

        const response = await request(app)
          .post('/payment-methods')
          .set('Authorization', `Bearer ${token}`)
          .send({
            type: 'CARD',
            card: { holder_name: 'João Silva' },
          });

        expect(response.status).toBe(400);
      });
    });

    it('deve retornar 400 para tipo de método inválido', async () => {
      (PaymentMethodService.createPaymentMethod as jest.Mock).mockRejectedValue(
        new AppError('Tipo de método de pagamento inválido.', 400)
      );

      const response = await request(app)
        .post('/payment-methods')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'INVALID_TYPE' });

      expect(response.status).toBe(400);
    });

    it('deve retornar 401 sem token', async () => {
      const response = await request(app)
        .post('/payment-methods')
        .send({ type: 'PIX', pix: { key: 'neto@gmail.com' } });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /payment-methods/:id', () => {
    it('deve deletar um método de pagamento com sucesso', async () => {
      (PaymentMethodService.deletePaymentMethod as jest.Mock).mockResolvedValue(
        { message: 'Método de pagamento removido com sucesso.' } as any
      );

      const response = await request(app)
        .delete('/payment-methods/1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Método de pagamento removido com sucesso.');
    });

    it('deve retornar 403 ao deletar método de outro usuário', async () => {
      (PaymentMethodService.deletePaymentMethod as jest.Mock).mockRejectedValue(
        new AppError('Acesso negado.', 403)
      );

      const response = await request(app)
        .delete('/payment-methods/2')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toMatch(/negado/);
    });

    it('deve retornar 404 para método inexistente', async () => {
      (PaymentMethodService.deletePaymentMethod as jest.Mock).mockRejectedValue(
        new AppError('Método de pagamento não encontrado.', 404)
      );

      const response = await request(app)
        .delete('/payment-methods/999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it('deve retornar 401 sem token', async () => {
      const response = await request(app).delete('/payment-methods/1');

      expect(response.status).toBe(401);
    });
  });
});