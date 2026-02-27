import dotenv from 'dotenv';
import app from './app';
import sequelize from './config/database';
import { createDefaultAdmin } from './utils/setupAdmin';

dotenv.config();

const PORT = process.env.PORT || 3000;

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