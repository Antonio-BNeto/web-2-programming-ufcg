import request from 'supertest';
import { mockItemResponse, mockItemRequest } from '../mocks';
import ItemService from '../../src/services/ItemService';
import app from '@/app';
import { generateTestToken } from '../helpers/auth';

jest.mock('../../src/services/ItemService');

describe('ItemController Integration', () => {

  const token = generateTestToken(1, 'USER');

  it('deve criar um item e retornar o DTO correto', async () => {
    (ItemService.createItem as jest.Mock).mockResolvedValue({
      toJSON: () => mockItemResponse
    });

    const response = await request(app)
      .post('/items')
      .set('Authorization', `Bearer ${token}`)
      .send(mockItemRequest);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockItemResponse);
  });
});