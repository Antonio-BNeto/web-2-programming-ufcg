export const ItemPaths = {
    '/items': {
        post: {
            summary: 'Endpoint usado para criar um novo item',
            tags: ['Items'],
            description: 'Cria um item. Requer nome e preço.',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/ItemCreate' },
                    },
                },
            },
            responses: {
                201: {
                    description: 'Item criado com sucesso',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ItemResponse' },
                        },
                    },
                },
                500: { description: 'Erro interno do servidor' },
            },
        },
        get: {
            summary: 'Endpoint usado para listar todos os itens',
            tags: ['Items'],
            responses: {
                200: {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/ItemResponse' },
                            },
                        },
                    },
                },
            },
        },
    },

    '/items/{id}': {
        get: {
            summary: 'Endpoint retornar um Item especifico pelo ID',
            tags: ['Items'],
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: { type: 'integer' },
                },
            ],
            responses: {
                200: {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ItemResponse' },
                        },
                    },
                },
                404: { description: 'Item não encontrado' },
            },
        },

        patch: {
            summary: 'Endpoint usado para atualizar um item',
            description: 'Atualiza parcialmente um item (nome ou preço).',
            tags: ['Items'],
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
                        schema: { $ref: '#/components/schemas/ItemUpdate' },
                    },
                },
            },
            responses: {
                200: { 
                    description: 'Item atualizado com sucesso',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ItemResponse' },
                        },
                    },
                },
                404: { description: 'Item não encontrado' },
            },
        },

        delete: {
            summary: 'Endpoint usado para remover um item',
            tags: ['Items'],
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: { type: 'integer' },
                },
            ],
            responses: {
                200: {
                    description: 'Item removido com sucesso',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ItemResponse' },
                        },
                    },
                },
                404: { description: 'Item não encontrado' },
            },
        },
    },
}