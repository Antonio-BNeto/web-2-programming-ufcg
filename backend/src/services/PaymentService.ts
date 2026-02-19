import sequelize from "../config/database";
import Payment from "../models/Payment";
import Sale from "../models/Sale";
import PaymentMethod from "../models/PaymentMethod";
import { paginate } from "../utils/pagination";
import { PaymentRequest } from "../dto/payment/PaymentRequest.dto";

class PaymentService {

  /**
   * Busca pagamentos com trava de segurança por usuário.
   */
  async getPaymentsPaginated(userId: number, isAdmin: boolean, page: number, limit: number) {
    const options: any = {
      include: [
        {
          model: Sale,
          as: 'sale', // Deve ser o mesmo alias definido em setupAssociations
          attributes: ['id', 'user_id', 'description', 'valueTotal'],
          // Trava de segurança: se não for admin, filtra pelo dono da venda
          where: isAdmin ? {} : { user_id: userId }
        }
      ]
    };

    return await paginate(Payment, page, limit, options);
  }

  /**
   * Cria um novo pagamento com validação de saldo e concorrência (Lock).
   */
  async createPayment(data: PaymentRequest) {
    const { saleId, paymentMethodId, value } = data;
    const transaction = await sequelize.transaction();

    try {
      if (value <= 0) {
        throw new Error("Valor do pagamento deve ser maior que zero.");
      }

      const sale = await Sale.findByPk(saleId, {
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      if (!sale) {
        throw new Error("Venda não encontrada.");
      }

      const paymentMethod = await PaymentMethod.findByPk(paymentMethodId, { transaction });
      if (!paymentMethod) {
        throw new Error("Método de pagamento não encontrado.");
      }

      // Calcula quanto já foi pago
      const existingPayments = await Payment.findAll({
        where: { saleId },
        transaction
      });

      const totalPaidSoFar = existingPayments.reduce((sum, p) => sum + p.value, 0);
      const remainingAmount = sale.valueTotal - totalPaidSoFar;

      // Usando uma margem pequena para lidar com floats se necessário
      if (value > (remainingAmount + 0.01)) {
        throw new Error(`Valor excede o saldo restante: R$ ${remainingAmount.toFixed(2)}`);
      }

      const payment = await Payment.create(
        {
          saleId,
          paymentMethodId,
          value,
          status: "PAID", // Ou PENDING, dependendo da sua regra de negócio
          paymentDate: new Date()
        },
        { transaction }
      );

      // Lógica automática: Se atingiu o total, atualiza a venda
      if (Math.abs(remainingAmount - value) < 0.01) {
        // await sale.update({ status: 'PAID' }, { transaction }); 
        // Descomente acima quando tiver o campo status em Sale
      }

      await transaction.commit();
      return payment;

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Busca pagamento por ID validando a propriedade (Ownership).
   */
  async getPaymentById(paymentId: number, userId: number, isAdmin: boolean) {
    const payment = await Payment.findByPk(paymentId, {
      include: [{
        model: Sale,
        as: 'sale',
        where: isAdmin ? {} : { user_id: userId }
      }]
    });

    if (!payment) {
      throw new Error("Pagamento não encontrado ou acesso negado.");
    }

    return payment;
  }

  /**
   * Remove pagamento e reverte o processo dentro de uma transação.
   */
  async deletePayment(paymentId: number, userId: number, isAdmin: boolean) {
    const transaction = await sequelize.transaction();

    try {
      const payment = await this.getPaymentById(paymentId, userId, isAdmin);

      await payment.destroy({ transaction });
      await transaction.commit();

      return { message: "Pagamento removido com sucesso." };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default new PaymentService();