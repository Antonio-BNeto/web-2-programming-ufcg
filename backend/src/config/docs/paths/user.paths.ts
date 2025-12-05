export const userPaths = {
  "/users": {
    post: {
      tags: ["Users"],
      summary: "Create a new user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/User" }
          }
        }
      },
      responses: {
        201: { description: "User created" }
      }
    },
    get: {
      tags: ["Users"],
      summary: "List all users",
      responses: {
        200: {
          description: "Success"
        }
      }
    }
  },

  "/users/{id}": {
    get: {
      tags: ["Users"],
      summary: "Get user by ID",
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
      tags: ["Users"],
      summary: "Update user",
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
            schema: { $ref: "#/components/schemas/User" }
          }
        }
      },
      responses: { 200: { description: "Updated" } }
    }
  }
};
