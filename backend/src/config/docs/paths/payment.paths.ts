export const paymentPaths = {
  '/payments': {
    post: {
      tags: ['Payments'],
      summary: 'Registrar um novo pagamento',
      description: 'Cria um registro de pagamento. SaleId, Value e Status são obrigatórios.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/PaymentCreate' },
          },
        },
      },
      responses: {
        201: {
          description: 'Pagamento criado com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PaymentResponse' },
            },
          },
        },
        400: { description: 'Erro ao criar pagamento (Dados inválidos)' },
      },
    },

    get: {
      tags: ['Payments'],
      summary: 'Listar todos os pagamentos',
      responses: {
        200: {
          description: 'Lista recuperada com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/PaymentResponse' },
              },
            },
          },
        },
        500: { description: 'Erro interno do servidor' },
      },
    },
  },

  '/payments/{id}': {
    get: {
      tags: ['Payments'],
      summary: 'Buscar um pagamento pelo ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
        },
      ],
      responses: {
        200: {
          description: 'Pagamento encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PaymentResponse' },
            },
          },
        },
        404: { description: 'Pagamento não encontrado' },
        500: { description: 'Erro interno do servidor' },
      },
    },

    patch: {
      tags: ['Payments'],
      summary: 'Atualizar um pagamento',
      description: 'Atualiza parcialmente um pagamento (ex: mudar status).',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/PaymentUpdate' },
          },
        },
      },
      responses: {
        200: {
          description: 'Pagamento atualizado com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PaymentResponse' },
            },
          },
        },
        404: { description: 'Pagamento não encontrado' },
        400: { description: 'Erro ao atualizar pagamento' },
      },
    },
  },
};