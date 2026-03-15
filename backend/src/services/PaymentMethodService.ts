import sequelize from "../config/database";
import User from "../models/User";
import PaymentMethod from "../models/PaymentMethod";
import Pix from "../models/Pix";
import BankAccount from "../models/BankAccount";
import Card from "../models/Card";
import { AppError } from "../errors/AppError";

class PaymentMethodService {
  async createPaymentMethod(
    userId: number,
    type: "PIX" | "CARD" | "BANK_ACCOUNT",
    data: any
  ) {
    const transaction = await sequelize.transaction();
    try {
      const user = await User.findByPk(userId, { transaction });
      if (!user) throw new AppError("Usuário não encontrado.", 404);

      const paymentMethod = await PaymentMethod.create(
        { userId, type },
        { transaction }
      );

      switch (type) {
        case "PIX":
          if (!data.pix?.key) throw new AppError("Chave PIX é obrigatória.", 400);
          await Pix.create(
            { payment_method_id: paymentMethod.id, key: data.pix.key },
            { transaction }
          );
          break;

        case "BANK_ACCOUNT":
          if (
            !data.bankAccount?.bank_name ||
            !data.bankAccount?.agency ||
            !data.bankAccount?.account_number ||
            !data.bankAccount?.account_type
          ) {
            throw new AppError("Dados bancários incompletos.", 400);
          }
          await BankAccount.create(
            {
              payment_method_id: paymentMethod.id,
              bank_name: data.bankAccount.bank_name,
              agency: data.bankAccount.agency,
              account_number: data.bankAccount.account_number,
              account_type: data.bankAccount.account_type,
            },
            { transaction }
          );
          break;

        case "CARD":
          if (
            !data.card?.holder_name ||
            !data.card?.card_number ||
            !data.card?.expiration_month ||
            !data.card?.expiration_year ||
            !data.card?.cvv
          ) {
            throw new AppError("Dados do cartão incompletos.", 400);
          }
          await Card.create(
            {
              payment_method_id: paymentMethod.id,
              holder_name: data.card.holder_name,
              card_number: data.card.card_number,
              expiration_month: data.card.expiration_month,
              expiration_year: data.card.expiration_year,
              cvv: data.card.cvv,
            },
            { transaction }
          );
          break;

        default:
          throw new AppError("Tipo de método de pagamento inválido.", 400);
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
      where: { userId },
      include: [
        { model: Pix, as: 'Pix' },
        { model: Card, as: 'Card' },
        { model: BankAccount, as: 'BankAccount' },
      ],
    });
  }

  async getPaymentMethodById(paymentMethodId: number) {
    const paymentMethod = await PaymentMethod.findByPk(paymentMethodId, {
      include: [
        { model: Pix, as: 'Pix' },
        { model: Card, as: 'Card' },
        { model: BankAccount, as: 'BankAccount' },
      ],
    });
    if (!paymentMethod) throw new AppError("Método de pagamento não encontrado.", 404);
    return paymentMethod;
  }

  async deletePaymentMethod(paymentMethodId: number, userId: number) {
    const paymentMethod = await PaymentMethod.findByPk(paymentMethodId);
    if (!paymentMethod) throw new AppError("Método de pagamento não encontrado.", 404);
    if (paymentMethod.userId !== userId) throw new AppError("Acesso negado.", 403);

    await paymentMethod.destroy();
    return { message: "Método de pagamento removido com sucesso." };
  }
}

export default new PaymentMethodService();