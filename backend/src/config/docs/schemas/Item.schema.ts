export const ItemSchema = {
  ItemCreate: {
    type: 'object',
    required: ['name', 'price'],
    properties: {
      name: {
        type: 'string',
        description: 'Nome do item',
        example: 'Camiseta Branca',
      },
      price: {
        type: 'number',
        description: 'Preço do item',
        example: 59.90,
      },
    },
  },

  ItemUpdate: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Nome do item',
        example: 'Camiseta Azul',
      },
      price: {
        type: 'number',
        description: 'Preço do item',
        example: 49.90,
      },
    },
  },

  ItemResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description: 'ID do item',
        example: 1,
      },
      name: {
        type: 'string',
        description: 'Nome do item',
        example: 'Camiseta Branca',
      },
      price: {
        type: 'number',
        description: 'Preço do item',
        example: 59.90,
      },
    },
  },
}