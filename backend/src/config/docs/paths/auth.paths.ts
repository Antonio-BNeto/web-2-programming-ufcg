export const authPaths = {
  '/auth/login': {
    post: {
      tags: ['Authentication'],
      summary: 'Realizar login e obter token JWT',
      description: 'Envie as credenciais de usuário para receber o token de acesso.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/LoginRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Login bem-sucedido',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginResponse' },
            },
          },
        },
        400: { description: 'E-mail ou senha inválidos' },
        500: { description: 'Erro interno no servidor' },
      },
    },
  },
};