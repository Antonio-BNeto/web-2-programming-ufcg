export const saleSchema = {
  SaleCreate: {
    type: "object",
    required: ["valueTotal", "description", "userId"],
    properties: {
      userId: {
        type: "integer",
        description: "ID do usuário responsável pela venda",
        example: 10
      },
      valueTotal: {
        type: "number",
        description: "Valor total da venda",
        example: 250.75
      },
      description: {
        type: "string",
        description: "Descrição ou observações da venda",
        example: "Venda de eletrônicos - Cliente VIP"
      }
    }
  },

  SaleUpdate: {
    type: "object",
    properties: {
      userId: {
        type: "integer",
        description: "ID do usuário (caso precise corrigir a autoria)",
        example: 10
      },
      valueTotal: {
        type: "number",
        description: "Valor total corrigido",
        example: 240.00
      },
      description: {
        type: "string",
        description: "Nova descrição",
        example: "Venda de eletrônicos - Cliente Comum"
      }
    }
  },

  SaleResponse: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        description: "ID único da venda",
        example: 101
      },
      userId: {
        type: "integer",
        description: "ID do usuário",
        example: 10
      },
      valueTotal: {
        type: "number",
        description: "Valor total da venda",
        example: 250.75
      },
      description: {
        type: "string",
        description: "Descrição da venda",
        example: "Venda de eletrônicos - Cliente VIP"
      }
    }
  }
};