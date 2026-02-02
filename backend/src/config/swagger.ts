import swaggerJsdoc from "swagger-jsdoc";
import { tags } from "./docs/tags";
import { authSchema } from "./docs/schemas/auth.schema";
import { paymentSchema } from "./docs/schemas/payment.schema";
import { userSchema } from "./docs/schemas/user.schema";
import { saleSchema } from "./docs/schemas/sale.schema";
import { ItemSchema } from "./docs/schemas/Item.schema";

import { authPaths } from "./docs/paths/auth.paths";
import { paymentPaths } from "./docs/paths/payment.paths";
import { userPaths } from "./docs/paths/user.paths";
import { salePaths } from "./docs/paths/sale.paths";
import { ItemPaths } from "./docs/paths/item.paths";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Brasa API",
      version: "1.0.0",
      description: "Sistema de Vendas com Autenticação JWT"
    },
    tags: tags,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Insira o token gerado no login sem o prefixo Bearer"
        },
      },
      schemas: {
        ...authSchema,
        ...paymentSchema,
        ...userSchema,
        ...ItemSchema,
        ...saleSchema
      }
    },
    security: [{ bearerAuth: [] }],
    paths: {
      ...authPaths,
      ...paymentPaths,
      ...userPaths,
      ...ItemPaths,
      ...salePaths
    }
  },
  apis: []
});