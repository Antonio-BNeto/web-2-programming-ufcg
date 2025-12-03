import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import userRoutes from './routes/user.routes';
import sequelize from './config/database';

const app = express();
app.use(express.json());

// swagger no link: http://localhost:3000/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/users', userRoutes);

const PORT = 3000;

sequelize.sync().then(() => {
  console.log('Banco de dados conectado');
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Documentação disponível em http://localhost:${PORT}/api-docs`);
  });
}).catch((err) => {
  console.error('Erro ao conectar no banco:', err);
});