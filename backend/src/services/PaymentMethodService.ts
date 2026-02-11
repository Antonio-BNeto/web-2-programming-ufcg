import sequelize from "../config/database";
import User from "../models/User";
import PaymentMethod from "../models/PaymentMethod";
import Pix from "../models/Pix";
import BankAccount from "../models/BankAccount";
import Card from "../models/Card";

class PaymentMethodService {

  async createPaymentMethod(
    userId: number,
    type: "PIX" | "CARD" | "BANK_ACCOUNT",
    data: any
  ) {
    const transaction = await sequelize.transaction();

    try {
      const user = await User.findByPk(userId, { transaction });

      if (!user) {
        throw new Error("Usuário não encontrado.");
      }

      const paymentMethod = await PaymentMethod.create(
        {
          user_id: userId,
          type,
        },
        { transaction }
      );

      switch (type) {

        case "PIX":
          if (!data.key) {
            throw new Error("Chave PIX é obrigatória.");
          }

          await Pix.create(
            {
              payment_method_id: paymentMethod.id,
              key: data.key,
            },
            { transaction }
          );
          break;

        case "BANK_ACCOUNT":
          if (
            !data.bank_name ||
            !data.agency ||
            !data.account_number ||
            !data.account_type
          ) {
            throw new Error("Dados bancários incompletos.");
          }

          await BankAccount.create(
            {
              payment_method_id: paymentMethod.id,
              bank_name: data.bank_name,
              agency: data.agency,
              account_number: data.account_number,
              account_type: data.account_type,
            },
            { transaction }
          );
          break;

        case "CARD":
          if (
            !data.holder_name ||
            !data.card_number ||
            !data.expiration_month ||
            !data.expiration_year ||
            !data.cvv
          ) {
            throw new Error("Dados do cartão incompletos.");
          }

          await Card.create(
            {
              payment_method_id: paymentMethod.id,
              holder_name: data.holder_name,
              card_number: data.card_number,
              expiration_month: data.expiration_month,
              expiration_year: data.expiration_year,
              cvv: data.cvv,
            },
            { transaction }
          );
          break;

        default:
          throw new Error("Tipo de método de pagamento inválido.");
      }

      await transaction.commit();
      return paymentMethod;

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getUserPaymentMethods(userId: number) {
    return await PaymentMethod.findAll({
      where: { user_id: userId },
      include: [Pix, BankAccount, Card],
    });
  }

  async getPaymentMethodById(paymentMethodId: number) {
    const paymentMethod = await PaymentMethod.findByPk(paymentMethodId, {
      include: [Pix, BankAccount, Card],
    });

    if (!paymentMethod) {
      throw new Error("Método de pagamento não encontrado.");
    }

    return paymentMethod;
  }

  async deletePaymentMethod(paymentMethodId: number, userId: number) {
    const paymentMethod = await PaymentMethod.findByPk(paymentMethodId);

    if (!paymentMethod) {
      throw new Error("Método de pagamento não encontrado.");
    }

    if (paymentMethod.user_id !== userId) {
      throw new Error("Acesso negado.");
    }

    await paymentMethod.destroy();

    return { message: "Método de pagamento removido com sucesso." };
  }
}

export default new PaymentMethodService();
