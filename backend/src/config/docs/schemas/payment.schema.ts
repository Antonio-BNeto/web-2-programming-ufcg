export const paymentSchema = {

  PaymentCreate: {
    type: "object",
    required: ["saleId", "value", "status"],
    properties: {
      saleId: {
        type: "integer",
        description: "ID da venda associada",
        example: 101
      },
      value: {
        type: "number",
        description: "Valor do pagamento",
        example: 150.50
      },
      status: {
        type: "string",
        description: "Status do pagamento",
        enum: ["PENDING", "PAID", "FAILED"],
        example: "PENDING"
      },
      paymentDate: {
        type: "string",
        format: "date-time",
        description: "Data do pagamento (opcional na criação, null = agora)",
        example: "2023-12-25T14:00:00.000Z"
      }
    }
  },

  PaymentUpdate: {
    type: "object",
    properties: {
      status: {
        type: "string",
        enum: ["PENDING", "PAID", "FAILED"],
        example: "PAID"
      },
      value: {
        type: "number",
        example: 150.50
      },
      paymentDate: {
        type: "string",
        format: "date-time"
      }
    }
  },

  PaymentResponse: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        description: "ID único do pagamento",
        example: 1
      },
      saleId: {
        type: "integer",
        example: 101
      },
      value: {
        type: "number",
        example: 150.50
      },
      status: {
        type: "string",
        example: "PENDING"
      },
      paymentDate: {
        type: "string",
        format: "date-time",
        example: "2023-12-25T14:00:00.000Z"
      }
    }
  }
};