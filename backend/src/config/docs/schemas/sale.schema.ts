export const saleSchema = {
  Sale: {
    type: "object",
    properties: {
      id: { type: "integer" },
      userId: { type: "integer" },
      itemId: { type: "integer" },
      quantity: { type: "integer" },
      total: { type: "number" },
      createdAt: { type: "string", format: "date-time" }
    }
  }
};
