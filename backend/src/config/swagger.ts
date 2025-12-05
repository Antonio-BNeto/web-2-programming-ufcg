import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "API Brasa",
      version: "1.0.0",
      description: "Documentação da API Brasa (Users, Payments)",
    },

    servers: [
      { url: "http://localhost:3000" }
    ],

    components: {
      schemas: {
        User: {
          type: "object",
          required: ["cpf", "name", "email", "password"],
          properties: {
            id: { type: "integer", description: "ID auto-gerado" },
            cpf: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            phoneNumber: { type: "string" },
            password: { type: "string" },
          },
        },

        Payment: {
          type: "object",
          required: ["saleId", "status", "value"],
          properties: {
            id: {
              type: "integer",
              description: "ID auto-gerado do pagamento"
            },
            saleId: {
              type: "integer",
              description: "ID da venda associada"
            },
            status: {
              type: "string",
              description: "Status do pagamento (pending, paid, failed)"
            },
            paymentDate: {
              type: "string",
              format: "date-time",
              nullable: true,
              description: "Data em que o pagamento ocorreu"
            },
            value: {
              type: "number",
              description: "Valor pago"
            }
          }
        }
      }
    },

    paths: {
      "/users": {
        post: {
          summary: "Cria um novo usuário",
          tags: ["Users"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          responses: {
            201: { description: "Criado com sucesso" },
            500: { description: "Erro no servidor" },
          },
        },

        get: {
          summary: "Lista todos os usuários",
          tags: ["Users"],
          responses: {
            200: {
              description: "Lista de usuários",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
        },
      },

      "/users/{id}": {
        get: {
          summary: "Busca usuário por ID",
          tags: ["Users"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: {
              description: "Usuário encontrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/User" },
                },
              },
            },
            404: { description: "Usuário não encontrado" },
          },
        },

        put: {
          summary: "Atualiza usuário",
          tags: ["Users"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          responses: {
            200: { description: "Atualizado com sucesso" },
            404: { description: "Não encontrado" },
          },
        },

        delete: {
          summary: "Remove usuário",
          tags: ["Users"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            204: { description: "Removido com sucesso" },
            404: { description: "Não encontrado" },
          },
        },
      },

      "/payments": {
        post: {
          summary: "Cria um novo pagamento",
          tags: ["Payments"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Payment" },
              },
            },
          },
          responses: {
            201: { description: "Pagamento criado com sucesso" },
            400: { description: "Dados inválidos" },
            500: { description: "Erro interno no servidor" },
          },
        },

        get: {
          summary: "Lista todos os pagamentos",
          tags: ["Payments"],
          responses: {
            200: {
              description: "Lista de pagamentos",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Payment" },
                  },
                },
              },
            },
          },
        },
      },

      "/payments/{id}": {
        get: {
          summary: "Busca um pagamento pelo ID",
          tags: ["Payments"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: {
              description: "Pagamento encontrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Payment" },
                },
              },
            },
            404: { description: "Pagamento não encontrado" },
          },
        },

        put: {
          summary: "Atualiza um pagamento",
          tags: ["Payments"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Payment" },
              },
            },
          },
          responses: {
            200: { description: "Pagamento atualizado com sucesso" },
            400: { description: "Dados inválidos" },
            404: { description: "Pagamento não encontrado" },
          },
        },
      },
    },
  },

  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
