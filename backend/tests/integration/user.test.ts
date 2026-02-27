import request from 'supertest';
import app from '@/app';
import UserService from '../../src/services/UserService';
import { AppError } from '@/errors/AppError';
import { generateTestToken } from '../helpers/auth';

jest.mock('../../src/services/UserService');

const mockUserPlain = {
  id: 1,
  name: 'Neto',
  email: 'neto@gmail.com',
  cpf: '12345678900',
  phoneNumber: '83999999999',
  role: 'USER',
};

const mockPaginatedUsers = {
  items: [mockUserPlain],
  total: 1,
  page: 1,
  limit: 10,
  totalPages: 1,
};

const createUserBody = {
  name: 'Neto',
  email: 'neto@gmail.com',
  password: 'Password123',
  cpf: '123.456.789-00',
  phoneNumber: '83999999999',
};

describe('UserController Integration', () => {
  const userToken = generateTestToken(1, 'USER');
  const adminToken = generateTestToken(2, 'ADMIN');

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /users', () => {
    it('deve criar um usuário com sucesso', async () => {
      (UserService.createUser as jest.Mock).mockResolvedValue({
        get: () => mockUserPlain,
      });

      const response = await request(app)
        .post('/users')
        .send(createUserBody);

      expect(response.status).toBe(201);
      expect(response.body.email).toBe('neto@gmail.com');
      expect(response.body.cpf).toBe('12345678900');
    });

    it('deve normalizar CPF removendo caracteres não numéricos', async () => {
      (UserService.createUser as jest.Mock).mockResolvedValue({
        get: () => ({ ...mockUserPlain, cpf: '12345678900' }),
      });

      const response = await request(app)
        .post('/users')
        .send(createUserBody);

      expect(response.status).toBe(201);
      expect(response.body.cpf).not.toContain('.');
      expect(response.body.cpf).not.toContain('-');
    });

    it('deve retornar 400 para CPF inválido', async () => {
      (UserService.createUser as jest.Mock).mockRejectedValue(
        new AppError('CPF inválido.', 400)
      );

      const response = await request(app)
        .post('/users')
        .send({ ...createUserBody, cpf: '000.000.000-00' });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/CPF inválido/);
    });

    it('deve retornar 400 para senha sem letra maiúscula', async () => {
      (UserService.createUser as jest.Mock).mockRejectedValue(
        new AppError('Senha deve conter ao menos uma letra maiúscula.', 400)
      );

      const response = await request(app)
        .post('/users')
        .send({ ...createUserBody, password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/maiúscula/);
    });

    it('deve retornar 400 para senha sem número', async () => {
      (UserService.createUser as jest.Mock).mockRejectedValue(
        new AppError('Senha deve conter ao menos um número.', 400)
      );

      const response = await request(app)
        .post('/users')
        .send({ ...createUserBody, password: 'Password' });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/número/);
    });

    it('deve retornar 400 para senha menor que 8 caracteres', async () => {
      (UserService.createUser as jest.Mock).mockRejectedValue(
        new AppError('Senha deve ter no mínimo 8 caracteres.', 400)
      );

      const response = await request(app)
        .post('/users')
        .send({ ...createUserBody, password: 'Pass1' });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/8 caracteres/);
    });

    it('deve retornar 409 para email já cadastrado', async () => {
      (UserService.createUser as jest.Mock).mockRejectedValue(
        new AppError('Email já cadastrado.', 409)
      );

      const response = await request(app)
        .post('/users')
        .send(createUserBody);

      expect(response.status).toBe(409);
      expect(response.body.message).toMatch(/Email já cadastrado/);
    });

    it('deve retornar 400 para campos obrigatórios ausentes', async () => {
      (UserService.createUser as jest.Mock).mockRejectedValue(
        new AppError('Todos os campos obrigatórios devem ser informados.', 400)
      );

      const response = await request(app)
        .post('/users')
        .send({ name: 'Neto' });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /users', () => {
    it('deve listar usuários paginados como admin', async () => {
      (UserService.getAllUsers as jest.Mock).mockResolvedValue(mockPaginatedUsers);

      const response = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.total).toBe(1);
    });

    it('deve respeitar parâmetros de paginação', async () => {
      (UserService.getAllUsers as jest.Mock).mockResolvedValue({
        ...mockPaginatedUsers,
        page: 2,
        limit: 5,
      });

      const response = await request(app)
        .get('/users?page=2&limit=5')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.page).toBe(2);
    });

    it('deve retornar 401 sem token', async () => {
      const response = await request(app).get('/users');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /users/:id', () => {
    it('deve retornar o próprio usuário', async () => {
      (UserService.getUserById as jest.Mock).mockResolvedValue({
        get: () => mockUserPlain,
      });

      const response = await request(app)
        .get('/users/1')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.email).toBe('neto@gmail.com');
    });

    it('deve permitir admin acessar qualquer usuário', async () => {
      (UserService.getUserById as jest.Mock).mockResolvedValue({
        get: () => mockUserPlain,
      });

      const response = await request(app)
        .get('/users/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });

    it('deve retornar 403 ao acessar dados de outro usuário', async () => {
      const response = await request(app)
        .get('/users/99')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toMatch(/negado/);
    });

    it('deve retornar 404 para usuário inexistente', async () => {
      (UserService.getUserById as jest.Mock).mockRejectedValue(
        new AppError('Usuário não encontrado.', 404)
      );

      const response = await request(app)
        .get('/users/999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/não encontrado/);
    });

    it('deve retornar 401 sem token', async () => {
      const response = await request(app).get('/users/1');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /users/:id', () => {
    const updateBody = { name: 'Neto Atualizado', email: 'neto.novo@gmail.com' };

    it('deve atualizar o próprio usuário com sucesso', async () => {
      const updated = { ...mockUserPlain, name: 'Neto Atualizado' };
      (UserService.updateUser as jest.Mock).mockResolvedValue({
        get: () => updated,
      });

      const response = await request(app)
        .put('/users/1')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateBody);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Neto Atualizado');
    });

    it('deve retornar 400 ao tentar alterar CPF', async () => {
      (UserService.updateUser as jest.Mock).mockRejectedValue(
        new AppError('CPF não pode ser alterado.', 400)
      );

      const response = await request(app)
        .put('/users/1')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ cpf: '98765432100' });

      expect(response.status).toBe(400);
    });

    it('deve retornar 403 ao tentar alterar role sem ser admin', async () => {
      (UserService.updateUser as jest.Mock).mockRejectedValue(
        new AppError('Apenas ADMIN pode alterar permissões.', 403)
      );

      const response = await request(app)
        .put('/users/1')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ role: 'ADMIN' });

      expect(response.status).toBe(403);
      expect(response.body.message).toMatch(/ADMIN/);
    });

    it('deve retornar 403 ao atualizar dados de outro usuário', async () => {
      const response = await request(app)
        .put('/users/99')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateBody);

      expect(response.status).toBe(403);
      expect(response.body.message).toMatch(/negado/);
    });

    it('deve retornar 409 para email já em uso', async () => {
      (UserService.updateUser as jest.Mock).mockRejectedValue(
        new AppError('Email já está em uso.', 409)
      );

      const response = await request(app)
        .put('/users/1')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ email: 'outro@gmail.com' });

      expect(response.status).toBe(409);
      expect(response.body.message).toMatch(/em uso/);
    });

    it('deve retornar 401 sem token', async () => {
      const response = await request(app)
        .put('/users/1')
        .send(updateBody);

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /users/:id', () => {
    it('deve deletar um usuário com sucesso', async () => {
      (UserService.deleteUser as jest.Mock).mockResolvedValue(
        { message: 'Usuário removido com sucesso.' }
      );

      const response = await request(app)
        .delete('/users/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Usuário removido com sucesso.');
    });

    it('deve retornar 400 ao deletar usuário com vendas vinculadas', async () => {
      (UserService.deleteUser as jest.Mock).mockRejectedValue(
        new AppError('Usuário possui vendas vinculadas.', 400)
      );

      const response = await request(app)
        .delete('/users/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/vendas vinculadas/);
    });

    it('deve retornar 400 ao deletar o último admin do sistema', async () => {
      (UserService.deleteUser as jest.Mock).mockRejectedValue(
        new AppError('O sistema deve ter pelo menos um ADMIN.', 400)
      );

      const response = await request(app)
        .delete('/users/2')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/pelo menos um ADMIN/);
    });

    it('deve retornar 404 para usuário inexistente', async () => {
      (UserService.deleteUser as jest.Mock).mockRejectedValue(
        new AppError('Usuário não encontrado.', 404)
      );

      const response = await request(app)
        .delete('/users/999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/não encontrado/);
    });

    it('deve retornar 401 sem token', async () => {
      const response = await request(app).delete('/users/1');

      expect(response.status).toBe(401);
    });
  });
});