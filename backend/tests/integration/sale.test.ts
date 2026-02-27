import request from 'supertest';
import  app from '@/app';
import SaleService from '../../src/services/SaleService';
import { generateTestToken } from '../helpers/auth';
import { mockSaleCreateRequest, mockSaleResponse } from '../mocks/saleMock';

jest.mock('../../src/services/SaleService');

describe('SaleController Integration', () => {
  const token = generateTestToken(1);

  it('deve criar uma venda e retornar o DTO SaleResponse', async () => {
    (SaleService.createSale as jest.Mock).mockResolvedValue(mockSaleResponse);

    const response = await request(app)
      .post('/sales')
      .set('Authorization', `Bearer ${token}`)
      .send(mockSaleCreateRequest);

    expect(response.status).toBe(201);
    expect(response.body.id).toBe(1);
    expect(response.body.valueTotal).toBe(450.00);
  });
});