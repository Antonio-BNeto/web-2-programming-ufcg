export const ItemSchema = {
  Item: {
  type: 'object',
  required: ['name', 'price'],
  properties: {
    id: {
      type: 'integer',
      description: 'ID do item',
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