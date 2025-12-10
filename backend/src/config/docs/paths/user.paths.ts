export const userPaths = {
  "/users": {
    post: {
      tags: ["Users"],
      summary: "Endpoint usado para criar um novo usuário",
      description: "Cria um usuário no sistema. Requer nome, email, senha e CPF.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UserCreate" }
          }
        }
      },
      responses: {
        201: {
          description: "Cria um usuário",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserResponse" }
            }
          }
        },
        400: { description: "Dados inválidos ou usuário já existente" },
        500: { description: "Erro interno do servidor" }
      }
    },
    get: {
      tags: ["Users"],
      summary: "Endpoint para listar todos os usuários cadastrados",
      responses: {
        200: {
          description: "Usuários listados com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/UserResponse" }
              }
            }
          }
        },
        500: { description: "Erro interno do servidor" }
      }
    }
  },

  "/users/{id}": {
    get: {
      tags: ["Users"],
      summary: "Endpoint que retorna apenas um usuário com base no seu id",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "ID numérico do usuário",
          schema: { type: "integer" }
        }
      ],
      responses: {
        200: {
          description: "Usuário encontrado",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserResponse" }
            }
          }
        },
        404: { description: "Usuário não encontrado" }
      }
    },

    patch: {
      tags: ["Users"],
      summary: "Endpoint que atualiza de forma parcial o usuário",
      description: "Atualiza apenas os campos enviados. Nenhum campo é obrigatório.",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "ID numérico do usuário a ser atualizado",
          schema: { type: "integer" }
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UserUpdate" }
          }
        }
      },
      responses: {
        200: {
          description: "Dados do usuário atualizados com sucesso",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserResponse" }
            }
          }
        },
        404: { description: "Usuário não encontrado" },
        400: { description: "Dados inválidos para atualização" }
      }
    },
  }
};