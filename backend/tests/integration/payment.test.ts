import request from 'supertest';
import app from '@/app';
import PaymentService from '../../src/services/PaymentService';
import { AppError } from '@/errors/AppError';
import { generateTestToken } from '../helpers/auth';

// ✅ jest.mock no topo — intercepta antes de qualquer importação
jest.mock('../../src/services/PaymentService');

const mockPayment = {
  id: 1,
  saleId: 1,
  paymentMethodId: 2,
  status: "PAID" as const,
  paymentDate: new Date("2024-01-15T10:00:00.000Z"),
  value: 150.75,
};

const mockPaginatedResponse = {
  items: [mockPayment],
  total: 1,
  page: 1,
  limit: 10,
  totalPages: 1,
};

describe('Payment Integration', () => {
  const adminToken = generateTestToken(1, 'ADMIN');
  const userToken = generateTestToken(1, 'USER');

  afterEach(() => {
    jest.clearAllMocks(); // ✅ clearAllMocks em vez de restoreAllMocks com jest.mock
  });

  describe('GET /payments', () => {
    it('deve listar pagamentos paginados do usuário', async () => {
      (PaymentService.getPaymentsPaginated as jest.Mock).mockResolvedValue(mockPaginatedResponse);

      const response = await request(app)
        .get('/payments')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.total).toBe(1);
    });

    it('deve respeitar parâmetros de paginação', async () => {
      (PaymentService.getPaymentsPaginated as jest.Mock).mockResolvedValue({
        items: [],
        total: 0,
        page: 2,
        limit: 5,
        totalPages: 0,
      });

      const response = await request(app)
        .get('/payments?page=2&limit=5')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.page).toBe(2);
    });

    it('deve retornar 401 sem token', async () => {
      const response = await request(app).get('/payments');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /payments/:id', () => {
    it('deve retornar um pagamento por id', async () => {
      (PaymentService.getPaymentById as jest.Mock).mockResolvedValue(mockPayment);

      const response = await request(app)
        .get('/payments/1')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.value).toBe(150.75);
    });

    it('deve retornar 404 para pagamento inexistente', async () => {
      (PaymentService.getPaymentById as jest.Mock).mockRejectedValue(
        new AppError('Pagamento não encontrado.', 404)
      );

      const response = await request(app)
        .get('/payments/999')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
    });

    it('deve retornar 401 sem token', async () => {
      const response = await request(app).get('/payments/1');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /payments', () => {
    const paymentBody = {
      saleId: 1,
      paymentMethodId: 2,
      value: 150.75,
      paymentDate: '2024-01-15T10:00:00.000Z',
    };

    it('deve criar um pagamento com sucesso', async () => {
      (PaymentService.createPayment as jest.Mock).mockResolvedValue(mockPayment);

      const response = await request(app)
        .post('/payments')
        .set('Authorization', `Bearer ${userToken}`)
        .send(paymentBody);

      expect(response.status).toBe(201);
      expect(response.body.saleId).toBe(1);
      expect(response.body.value).toBe(150.75);
      expect(response.body.status).toBe('PAID');
    });

    it('deve retornar 400 se o valor exceder o saldo da venda', async () => {
      (PaymentService.createPayment as jest.Mock).mockRejectedValue(
        new AppError('Valor excede o saldo restante', 400)
      );

      const response = await request(app)
        .post('/payments')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ ...paymentBody, value: 99999 });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/saldo restante/);
    });

    it('deve retornar 401 sem token', async () => {
      const response = await request(app)
        .post('/payments')
        .send(paymentBody);

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /payments/:id', () => {
    it('deve deletar um pagamento com sucesso', async () => {
      (PaymentService.deletePayment as jest.Mock).mockResolvedValue(
        { message: 'Pagamento deletado com sucesso' }
      );

      const response = await request(app)
        .delete('/payments/1')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Pagamento deletado com sucesso');
    });

    it('deve retornar 404 para pagamento inexistente', async () => {
      (PaymentService.deletePayment as jest.Mock).mockRejectedValue(
        new AppError('Pagamento não encontrado ou acesso negado.', 404)
      );

      const response = await request(app)
        .delete('/payments/999')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
    });

    it('deve retornar 401 sem token', async () => {
      const response = await request(app).delete('/payments/1');

      expect(response.status).toBe(401);
    });
  });
});