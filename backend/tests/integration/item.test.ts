import request from 'supertest';
import app from '@/app';
import ItemService from '@/services/ItemService';
import { AppError } from '@/errors/AppError';
import { generateTestToken } from '../helpers/auth';

const mockItem = {
  id: 1,
  name: "Teclado Mecânico",
  description: "Teclado RGB switch blue",
  price: 250.5,
  quantity: 10,
  userId: 1
};

describe('Item Integration', () => {
  const adminToken = generateTestToken(1, 'ADMIN');
  const userToken = generateTestToken(1, 'USER');

  describe('POST /items', () => {
    it('deve criar um item com sucesso', async () => {
      jest.spyOn(ItemService, 'createItem').mockResolvedValue({
        toJSON: () => mockItem
      } as any);

      const response = await request(app)
        .post('/items')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: "Teclado Mecânico",
          description: "Teclado RGB switch blue",
          price: 250.5,
          quantity: 10
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe("Teclado Mecânico");
    });

    it('deve retornar 401 sem token', async () => {
      const response = await request(app)
        .post('/items')
        .send({ name: "Teclado", description: "desc", price: 100, quantity: 5 });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /items', () => {
    it('deve listar itens paginados', async () => {
      jest.spyOn(ItemService, 'getAllItems').mockResolvedValue({
        items: [{ toJSON: () => mockItem } as any],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1
      });

      const response = await request(app).get('/items');

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.totalItems).toBe(1);
      expect(response.body.currentPage).toBe(1);
    });

    it('deve respeitar parâmetros de paginação', async () => {
      jest.spyOn(ItemService, 'getAllItems').mockResolvedValue({
        items: [],
        total: 0,
        page: 2,
        limit: 5,
        totalPages: 0
      });

      const response = await request(app).get('/items?page=2&limit=5');

      expect(response.status).toBe(200);
      expect(response.body.currentPage).toBe(2);
    });
  });

  describe('GET /items/:id', () => {
    it('deve retornar um item por id', async () => {
      jest.spyOn(ItemService, 'getItemById').mockResolvedValue({
        toJSON: () => mockItem
      } as any);

      const response = await request(app).get('/items/1');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.name).toBe("Teclado Mecânico");
    });

    it('deve retornar 404 para item inexistente', async () => {
      jest.spyOn(ItemService, 'getItemById').mockRejectedValue(
        new AppError("Item não encontrado.", 404)
      );

      const response = await request(app).get('/items/999');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /items/:id', () => {
    it('deve atualizar um item com sucesso', async () => {
      const updated = { ...mockItem, name: "Teclado Atualizado" };
      jest.spyOn(ItemService, 'updateItem').mockResolvedValue({
        toJSON: () => updated
      } as any);

      const response = await request(app)
        .put('/items/1')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: "Teclado Atualizado" });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Teclado Atualizado");
    });

    it('deve retornar 401 sem token', async () => {
      const response = await request(app)
        .put('/items/1')
        .send({ name: "Teclado Atualizado" });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /items/:id', () => {
    it('deve deletar um item com sucesso', async () => {
      jest.spyOn(ItemService, 'deleteItem').mockResolvedValue(undefined);

      const response = await request(app)
        .delete('/items/1')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Item deletado com sucesso");
    });

    it('deve retornar 401 sem token', async () => {
      const response = await request(app).delete('/items/1');

      expect(response.status).toBe(401);
    });

    it('deve retornar 404 para item inexistente', async () => {
      jest.spyOn(ItemService, 'deleteItem').mockRejectedValue(
        new AppError("Item não encontrado ou acesso negado.", 404)
      );

      const response = await request(app)
        .delete('/items/999')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
    });
  });
});