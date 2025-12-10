import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import userRoutes from './routes/user.routes';
import paymentRoutes from './routes/payment.routes';
import saleRoutes from './routes/sale.routes';
import ItemRoutes from './routes/item.routes';
import sequelize from './config/database';

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/users', userRoutes);
app.use('/payments', paymentRoutes);
app.use('/sales', saleRoutes);
app.use('/items', ItemRoutes);


const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => {
    console.log('💾 Banco conectado com sucesso!');

    return sequelize.sync();
  })
  .then(() => {
    console.log('📦 Models sincronizados.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📄 Swagger: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('❌ Erro ao iniciar aplicação:', err);
  });
