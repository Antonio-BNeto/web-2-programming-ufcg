import sequelize from "../config/database";
import Payment from "../models/Payment";
import Sale from "../models/Sale";
import PaymentMethod from "../models/PaymentMethod";

class PaymentService {

  async createPayment(
    saleId: number,
    paymentMethodId: number,
    value: number
  ) {
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

      const paymentMethod = await PaymentMethod.findByPk(paymentMethodId, {
        transaction
      });

      if (!paymentMethod) {
        throw new Error("Método de pagamento não encontrado.");
      }

      const existingPayments = await Payment.findAll({
        where: { saleId },
        transaction
      });

      const totalPaid = existingPayments.reduce(
        (sum, payment) => sum + payment.value,
        0
      );

      const remainingAmount = sale.valueTotal - totalPaid;

      if (value > remainingAmount) {
        throw new Error("Valor excede o saldo restante da venda.");
      }

      const payment = await Payment.create(
        {
          saleId,
          paymentMethodId,
          value,
          status: "PENDING",
          paymentDate: null
        },
        { transaction }
      );

      await transaction.commit();
      return payment;

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getPaymentsBySale(saleId: number) {
    return await Payment.findAll({
      where: { saleId }
    });
  }

  async getPaymentById(paymentId: number) {
    const payment = await Payment.findByPk(paymentId);

    if (!payment) {
      throw new Error("Pagamento não encontrado.");
    }

    return payment;
  }

  async deletePayment(paymentId: number) {
    const transaction = await sequelize.transaction();

    try {
      const payment = await Payment.findByPk(paymentId, { transaction });

      if (!payment) {
        throw new Error("Pagamento não encontrado.");
      }

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
