import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import userRoutes from './routes/user.routes';
import paymentRoutes from './routes/payment.routes';
import saleRoutes from './routes/sale.routes';
import ItemRoutes from './routes/item.routes';
import authRoutes from './routes/auth.routes';
import sequelize from './config/database';
import dotenv from 'dotenv';


dotenv.config();

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/auth', authRoutes)

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
