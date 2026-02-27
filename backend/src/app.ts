import "reflect-metadata";
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger/swagger.json';
import { RegisterRoutes } from './swagger/routes';
import { setupAssociations } from './models/associations';

setupAssociations();

const app = express();
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
RegisterRoutes(app);

export default app;