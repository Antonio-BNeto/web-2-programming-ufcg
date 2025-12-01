import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Brasa',
      version: '1.0.0',
      description: 'Documentação da API de Usuários',
    },
    servers: [
      { url: 'http://localhost:3000' },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['cpf', 'name', 'email', 'password'],
          properties: {
            id: { type: 'integer', description: 'ID auto-gerado' },
            cpf: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            phoneNumber: { type: 'string' },
            password: { type: 'string' },
          },
        },
      },
    },
    paths: {
      '/users': {
        post: {
          summary: 'Cria um novo usuário',
          tags: ['Users'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          responses: {
            201: { description: 'Criado com sucesso' },
            500: { description: 'Erro no servidor' },
          },
        },
        get: {
          summary: 'Lista todos os usuários',
          tags: ['Users'],
          responses: {
            200: {
              description: 'Lista de usuários',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
        },
      },
      '/users/{id}': {
        get: {
          summary: 'Busca usuário por ID',
          tags: ['Users'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'integer' },
              description: 'ID do usuário',
            },
          ],
          responses: {
            200: {
              description: 'Dados do usuário',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/User' },
                },
              },
            },
            404: { description: 'Usuário não encontrado' },
          },
        },
        put: {
          summary: 'Atualiza usuário',
          tags: ['Users'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          responses: {
            200: { description: 'Atualizado com sucesso' },
            404: { description: 'Não encontrado' },
          },
        },
        delete: {
          summary: 'Remove usuário',
          tags: ['Users'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            204: { description: 'Removido com sucesso' },
            404: { description: 'Não encontrado' },
          },
        },
      },
    },
  },

  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;