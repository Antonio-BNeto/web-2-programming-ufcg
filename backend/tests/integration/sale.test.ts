import request from 'supertest';
import app from '@/app';
import SaleService from '../../src/services/SaleService';
import { AppError } from '@/errors/AppError';
import { generateTestToken } from '../helpers/auth';
import { mockSaleCreateRequest, mockSaleResponse } from '../mocks/saleMock';

jest.mock('../../src/services/SaleService');

const mockPaginatedSales = {
  items: [mockSaleResponse],
  total: 1,
  page: 1,
  limit: 10,
  totalPages: 1,
};

describe('SaleController Integration', () => {
  const userToken = generateTestToken(1, 'USER');
  const adminToken = generateTestToken(2, 'ADMIN');

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /sales', () => {
    it('deve criar uma venda e retornar o DTO SaleResponse', async () => {
      (SaleService.createSale as jest.Mock).mockResolvedValue(mockSaleResponse);

      const response = await request(app)
        .post('/sales')
        .set('Authorization', `Bearer ${userToken}`)
        .send(mockSaleCreateRequest);

      expect(response.status).toBe(201);
      expect(response.body.id).toBe(1);
      expect(response.body.valueTotal).toBe(450.00);
    });

    it('deve retornar 400 quando a venda não contém itens', async () => {
      (SaleService.createSale as jest.Mock).mockRejectedValue(
        new AppError('A venda deve conter ao menos um item.', 400)
      );

      const response = await request(app)
        .post('/sales')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ ...mockSaleCreateRequest, items: [] });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/ao menos um item/);
    });

    it('deve retornar 404 quando um item da venda não existe', async () => {
      (SaleService.createSale as jest.Mock).mockRejectedValue(
        new AppError('Item 99 não encontrado.', 404)
      );

      const response = await request(app)
        .post('/sales')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ ...mockSaleCreateRequest, items: [{ itemId: 99, quantity: 1 }] });

      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/não encontrado/);
    });

    it('deve retornar 400 quando estoque é insuficiente', async () => {
      (SaleService.createSale as jest.Mock).mockRejectedValue(
        new AppError('Estoque insuficiente: Teclado Mecânico', 400)
      );

      const response = await request(app)
        .post('/sales')
        .set('Authorization', `Bearer ${userToken}`)
        .send(mockSaleCreateRequest);

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/Estoque insuficiente/);
    });

    it('deve retornar 401 sem token', async () => {
      const response = await request(app)
        .post('/sales')
        .send(mockSaleCreateRequest);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /sales', () => {
    it('deve listar vendas paginadas do usuário', async () => {
      (SaleService.getSalesPaginated as jest.Mock).mockResolvedValue(mockPaginatedSales);

      const response = await request(app)
        .get('/sales')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.total).toBe(1);
    });

    it('deve respeitar parâmetros de paginação', async () => {
      (SaleService.getSalesPaginated as jest.Mock).mockResolvedValue({
        ...mockPaginatedSales,
        page: 2,
        limit: 5,
      });

      const response = await request(app)
        .get('/sales?page=2&limit=5')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.page).toBe(2);
    });

    it('deve retornar 401 sem token', async () => {
      const response = await request(app).get('/sales');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /sales/admin/all', () => {
    it('deve listar todas as vendas como admin', async () => {
      (SaleService.getAllSalesPaginatedAdmin as jest.Mock).mockResolvedValue(mockPaginatedSales);

      const response = await request(app)
        .get('/sales/admin/all')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
    });

    it('deve retornar 401 sem token', async () => {
      const response = await request(app).get('/sales/admin/all');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /sales/:id', () => {
    it('deve retornar uma venda por id', async () => {
      (SaleService.getSaleById as jest.Mock).mockResolvedValue(mockSaleResponse);

      const response = await request(app)
        .get('/sales/1')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.valueTotal).toBe(450.00);
    });

    it('deve retornar 404 para venda inexistente', async () => {
      (SaleService.getSaleById as jest.Mock).mockRejectedValue(
        new AppError('Venda não encontrada ou acesso negado.', 404)
      );

      const response = await request(app)
        .get('/sales/999')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/não encontrada/);
    });

    it('deve retornar 401 sem token', async () => {
      const response = await request(app).get('/sales/1');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /sales/user/:userId', () => {
    it('deve listar vendas do próprio usuário', async () => {
      (SaleService.getSalesPaginated as jest.Mock).mockResolvedValue(mockPaginatedSales);

      const response = await request(app)
        .get('/sales/user/1')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
    });

    it('deve permitir admin listar vendas de qualquer usuário', async () => {
      (SaleService.getSalesPaginated as jest.Mock).mockResolvedValue(mockPaginatedSales);

      const response = await request(app)
        .get('/sales/user/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });

    it('deve retornar 403 ao acessar vendas de outro usuário', async () => {
      const response = await request(app)
        .get('/sales/user/99')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toMatch(/negado/);
    });

    it('deve retornar 401 sem token', async () => {
      const response = await request(app).get('/sales/user/1');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /sales/:id', () => {
    const updateBody = { description: 'Venda atualizada', status: 'CONFIRMED' };

    it('deve atualizar uma venda com sucesso', async () => {
      const updatedSale = { ...mockSaleResponse, description: 'Venda atualizada', status: 'CONFIRMED' };
      (SaleService.updateSale as jest.Mock).mockResolvedValue(updatedSale);

      const response = await request(app)
        .put('/sales/1')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateBody);

      expect(response.status).toBe(200);
      expect(response.body.description).toBe('Venda atualizada');
      expect(response.body.status).toBe('CONFIRMED');
    });

    it('deve retornar 400 ao tentar alterar venda finalizada', async () => {
      (SaleService.updateSale as jest.Mock).mockRejectedValue(
        new AppError('Venda finalizada não pode ser alterada.', 400)
      );

      const response = await request(app)
        .put('/sales/1')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateBody);

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/finalizada/);
    });

    it('deve retornar 404 para venda inexistente', async () => {
      (SaleService.updateSale as jest.Mock).mockRejectedValue(
        new AppError('Venda não encontrada ou acesso negado.', 404)
      );

      const response = await request(app)
        .put('/sales/999')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateBody);

      expect(response.status).toBe(404);
    });

    it('deve retornar 401 sem token', async () => {
      const response = await request(app)
        .put('/sales/1')
        .send(updateBody);

      expect(response.status).toBe(401);
    });
  });
});