export const paymentPaths = {
  "/payments": {
    post: {
      tags: ["Payments"],
      summary: "Create payment",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Payment" }
          }
        }
      },
      responses: {
        201: { description: "Created" }
      }
    },
    get: {
      tags: ["Payments"],
      summary: "List all payments",
      responses: {
        200: {
          description: "Success",
        }
      }
    }
  },

  "/payments/{id}": {
    get: {
      tags: ["Payments"],
      summary: "Get payment by id",
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
      tags: ["Payments"],
      summary: "Update payment",
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
            schema: { $ref: "#/components/schemas/Payment" }
          }
        }
      },
      responses: { 200: { description: "Updated" } }
    }
  }
};
