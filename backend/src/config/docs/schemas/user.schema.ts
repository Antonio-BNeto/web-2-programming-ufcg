export const userSchema = {
  UserCreate: {
    type: "object",
    required: ["name", "email", "password", "cpf"],
    properties: {
      cpf: {
        type: "string",
        example: "123.456.789-00"
      },
      phoneNumber: {
        type: "string",
        example: "(83) 99999-8888"
      },
      name: {
        type: "string",
        example: "Antonio Barros"
      },
      email: {
        type: "string",
        format: "email",
        example: "antonio.barros@email.com"
      },
      password: {
        type: "string",
        format: "password",
        example: "SenhaForte@123"
      }
    }
  },

  UserUpdate: {
    type: "object",
    properties: {
      cpf: { type: "string", example: "123.456.789-00" },
      phoneNumber: { type: "string", example: "(83) 98888-7777" },
      name: { type: "string", example: "Antonio Neto" },
      email: { type: "string", format: "email", example: "antonio.neto@email.com" },
      password: { type: "string", format: "password", example: "NovaSenha@123" }
    }
  },

  UserResponse: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        example: 42
      },
      cpf: { type: "string", example: "123.456.789-00" },
      phoneNumber: { type: "string", example: "(83) 99999-8888" },
      name: { type: "string", example: "Antonio Barros" },
      email: { type: "string", format: "email", example: "antonio.barros@email.com" }
    }
  },

  UserLogin: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: {
        type: "string",
        format: "email",
        example: "antonio.barros@email.com"
      },
      password: {
        type: "string",
        format: "password",
        example: "SenhaForte@123"
      }
    }
  }
};