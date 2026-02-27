import "reflect-metadata";
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

import swaggerDocument from './swagger/swagger.json';
import { RegisterRoutes } from './swagger/routes';

import sequelize from './config/database';
import { createDefaultAdmin } from './utils/setupAdmin';
import { setupAssociations } from './models/associations';

dotenv.config();

setupAssociations();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

RegisterRoutes(app);

console.log("✅ Rotas e Swagger carregados via TSOA");

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('💾 Banco conectado com sucesso!');

    await sequelize.sync({ alter: true });
    console.log('🔄 Banco de dados sincronizado.');

    await createDefaultAdmin();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📄 Swagger: http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error('❌ Erro fatal ao iniciar aplicação:', err);
    process.exit(1);
  }
};

startServer();