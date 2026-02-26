import sequelize from "../config/database";
import Payment from "../models/Payment";
import Sale from "../models/Sale";
import PaymentMethod from "../models/PaymentMethod";
import { paginate } from "../utils/pagination";
import { PaymentRequest } from "../dto/payment/PaymentRequest.dto";
import { PaymentResponse } from "../dto/payment/PaymentResponse.dto";
import { PaginatedResponse } from "../dto/shared/PaginatedResponse.dto";

class PaymentService {

  // =========================
  // 🔹 MAPPER (Model → DTO)
  // =========================
  private mapToResponse(payment: Payment): PaymentResponse {
    return {
      id: payment.id,
      saleId: payment.saleId,
      paymentMethodId: payment.paymentMethodId,
      value: Number(payment.value),
      status: payment.status,
      paymentDate: payment.paymentDate,
      sale: payment.sale
        ? {
            id: payment.sale.id,
            userId: payment.sale.userId,
            description: payment.sale.description,
            valueTotal: payment.sale.valueTotal
          }
        : undefined
    };
  }

  // =========================
  // 🔹 PAGINAÇÃO
  // =========================
  async getPaymentsPaginated(
    userId: number,
    isAdmin: boolean,
    page: number,
    limit: number
  ): Promise<PaginatedResponse<PaymentResponse>> {

    const result = await paginate(Payment, page, limit, {
      include: [
        {
          model: Sale,
          as: "sale",
          attributes: ["id", "userId", "description", "valueTotal"],
          where: isAdmin ? {} : { userId }
        }
      ],
      order: [["id", "DESC"]]
    });

    return {
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      items: result.items.map((p: Payment) =>
        this.mapToResponse(p)
      )
    };
  }

  // =========================
  // 🔹 CREATE PAYMENT
  // =========================
  async createPayment(
    data: PaymentRequest,
    userId: number
  ): Promise<PaymentResponse> {

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

      // 🔒 Se não for admin, só pode pagar própria venda
      if (sale.userId !== userId) {
        throw new Error("Acesso negado.");
      }

      const paymentMethod = await PaymentMethod.findByPk(paymentMethodId, {
        transaction
      });

      if (!paymentMethod) {
        throw new Error("Método de pagamento não encontrado.");
      }

      const existingPayments = await Payment.findAll({
        where: { saleId },
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      const totalPaidSoFar = existingPayments.reduce(
        (sum, p) => sum + Number(p.value),
        0
      );

      const saleTotal = Number(sale.valueTotal);
      const remainingAmount = saleTotal - totalPaidSoFar;

      if (value > remainingAmount + 0.01) {
        throw new Error(
          `Valor excede o saldo restante: R$ ${remainingAmount.toFixed(2)}`
        );
      }

      const payment = await Payment.create(
        {
          saleId,
          paymentMethodId,
          value,
          status: "PAID",
          paymentDate: new Date()
        },
        { transaction }
      );

      await transaction.commit();

      return this.mapToResponse(payment);

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // =========================
  // 🔹 GET BY ID
  // =========================
  async getPaymentById(
    paymentId: number,
    userId: number,
    isAdmin: boolean
  ): Promise<PaymentResponse> {

    const payment = await Payment.findByPk(paymentId, {
      include: [
        {
          model: Sale,
          as: "sale",
          where: isAdmin ? {} : { userId }
        }
      ]
    });

    if (!payment) {
      throw new Error("Pagamento não encontrado ou acesso negado.");
    }

    return this.mapToResponse(payment);
  }

  // =========================
  // 🔹 DELETE
  // =========================
  async deletePayment(
    paymentId: number,
    userId: number,
    isAdmin: boolean
  ) {
    const transaction = await sequelize.transaction();

    try {
      const payment = await Payment.findByPk(paymentId, {
        include: [
          {
            model: Sale,
            as: "sale",
            where: isAdmin ? {} : { userId }
          }
        ],
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      if (!payment) {
        throw new Error("Pagamento não encontrado ou acesso negado.");
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