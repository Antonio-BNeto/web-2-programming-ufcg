import express from 'express';
import swaggerUi from 'swagger-ui-express';
import sequelize from './config/database';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Função de configuração movida para garantir execução antes do listen
const setupApp = async () => {
  try {
    const swaggerDocument = await import('./swagger/swagger.json');
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
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📄 Swagger: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('❌ Erro ao iniciar aplicação:', err);
  });