export const saleSchema = {
  // 1. Schema para Criação (POST)
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

  // 2. Schema para Atualização (PATCH)
  // Nenhum campo obrigatório, usado para correção de dados
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

  // 3. Schema para Resposta (GET)
  // Retorna o objeto completo persistido no banco
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