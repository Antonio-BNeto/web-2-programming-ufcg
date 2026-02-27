import "reflect-metadata";
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger/swagger.json';
import { RegisterRoutes } from './swagger/routes';
import { setupAssociations } from './models/associations';
import { AppError } from "./errors/AppError";

setupAssociations();

const app = express();
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
RegisterRoutes(app);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  return res.status(500).json({ message: err.message || 'Erro interno do servidor' });
});

export default app;