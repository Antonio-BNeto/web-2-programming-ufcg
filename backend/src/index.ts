import "reflect-metadata";
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import sequelize from './config/database';
import dotenv from 'dotenv';
import fs from 'fs'; // Importação necessária
import path from 'path'; // Importação necessária
import { createDefaultAdmin } from './utils/setupAdmin';
import { setupAssociations } from './models/associations';

dotenv.config();

setupAssociations();
const app = express();
app.use(express.json());

const setupApp = async () => {
  try {
    const swaggerPath = path.join(__dirname, './swagger/swagger.json');
    const swaggerData = fs.readFileSync(swaggerPath, 'utf8');
    const swaggerDocument = JSON.parse(swaggerData);

    const { RegisterRoutes } = await import('./swagger/routes');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    RegisterRoutes(app);

    console.log("✅ Rotas e Swagger carregados via TSOA");
  } catch (err) {
    console.error("⚠️ Erro ao carregar Swagger/Rotas:", err);
  }
};

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(async () => {
    console.log('💾 Banco conectado com sucesso!');

    await setupApp();

    return sequelize.sync({ alter: true });
  })
  .then(async () => {
    await createDefaultAdmin();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📄 Swagger: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('❌ Erro ao iniciar aplicação:', err);
  });