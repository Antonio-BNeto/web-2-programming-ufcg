export const ItemPaths = {
    '/items': {
        post: {
            summary: 'Cria um novo item',
            tags: ['Items'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Item' },
                    },
                },
            },
            responses: {
                201: { description: 'Item criado com sucesso' },
                500: { description: 'Erro no servidor' },
            },
        },
        get: {
            summary: 'Lista todos os itens',
            tags: ['Items'],
            responses: {
                200: {
                    description: 'Lista de itens',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/Item' },
                            },
                        },
                    },
                },
            },
        },
    },

    '/items/{id}': {
        get: {
            summary: 'Busca item por ID',
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
                    description: 'Item encontrado',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Item' },
                        },
                    },
                },
                404: { description: 'Item não encontrado' },
            },
        },

        put: {
            summary: 'Atualiza item',
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
                        schema: { $ref: '#/components/schemas/Item' },
                    },
                },
            },
            responses: {
                200: { description: 'Item atualizado com sucesso' },
                404: { description: 'Item não encontrado' },
            },
        },
    },

}