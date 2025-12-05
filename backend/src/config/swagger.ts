import swaggerJsdoc from "swagger-jsdoc";
import { tags } from "./docs/tags";

import { paymentSchema } from "./docs/schemas/payment.schema";
import { userSchema } from "./docs/schemas/user.schema";
import { saleSchema } from "./docs/schemas/sale.schema";
import { ItemSchema } from "./docs/schemas/Item.schema";

import { paymentPaths } from "./docs/paths/payment.paths";
import { userPaths } from "./docs/paths/user.paths";
import { salePaths } from "./docs/paths/sale.paths";
import { ItemPaths } from "./docs/paths/item.paths";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Brasa API",
      version: "1.0.0"
    },
    tags: tags,
    components: {
      schemas: {
        ...paymentSchema,
        ...userSchema,
        ...ItemSchema,
        ...saleSchema
      }
    },
    paths: {
      ...paymentPaths,
      ...userPaths,
      ...ItemPaths,
      ...salePaths
    }
  },
  apis: []
});
