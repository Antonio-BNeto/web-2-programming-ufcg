export const paymentSchema = {
  Payment: {
    type: "object",
    properties: {
      id: { type: "integer" },
      saleId: { type: "integer" },
      status: { type: "string" },
      paymentDate: { type: "string", format: "date-time" },
      value: { type: "number" }
    }
  }
};