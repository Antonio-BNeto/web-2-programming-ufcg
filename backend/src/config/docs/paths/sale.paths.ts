export const salePaths = {
  "/sales": {
    post: {
      tags: ["Sales"],
      summary: "Registrar uma nova venda",
      description: "Cria um registro de venda. Requer ID do usuário, valor total e descrição.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/SaleCreate" }
          }
        }
      },
      responses: {
        201: {
          description: "Venda registrada com sucesso",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SaleResponse" }
            }
          }
        },
        500: { description: "Erro interno do servidor" }
      }
    },
    get: {
      tags: ["Sales"],
      summary: "Listar todas as vendas",
      responses: {
        200: {
          description: "Lista recuperada com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/SaleResponse" }
              }
            }
          }
        }
      }
    }
  },

  "/sales/{id}": {
    get: {
      tags: ["Sales"],
      summary: "Buscar uma venda pelo ID",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "ID da venda",
          schema: { type: "integer" }
        }
      ],
      responses: {
        200: {
          description: "Venda encontrada",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SaleResponse" }
            }
          }
        },
        404: { description: "Venda não encontrada" }
      }
    },

    patch: {
      tags: ["Sales"],
      summary: "Atualizar dados de uma venda",
      description: "Atualiza parcialmente uma venda (ex: corrigir valor ou descrição).",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" }
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/SaleUpdate" }
          }
        }
      },
      responses: {
        200: {
          description: "Venda atualizada com sucesso",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SaleResponse" }
            }
          }
        },
        404: { description: "Venda não encontrada" }
      }
    }
  }
};