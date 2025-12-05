export const salePaths = {
  "/sales": {
    post: {
      tags: ["Sales"],
      summary: "Create a new sale",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Sale" }
          }
        }
      },
      responses: { 201: { description: "Created" } }
    },
    get: {
      tags: ["Sales"],
      summary: "List all sales",
      responses: { 200: { description: "Success" } }
    }
  },

  "/sales/{id}": {
    get: {
      tags: ["Sales"],
      summary: "Get sale by ID",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" }
        }
      ],
      responses: { 200: { description: "Success" } }
    },
    put: {
      tags: ["Sales"],
      summary: "Update sale",
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
            schema: { $ref: "#/components/schemas/Sale" }
          }
        }
      },
      responses: { 200: { description: "Updated" } }
    }
  }
};
