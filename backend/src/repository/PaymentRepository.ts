import { Payment, PaymentAttributes, PaymentCreationAttributes } from "../models/Payment";

export class PaymentRepository {
    async create(data: PaymentCreationAttributes): Promise<Payment> {
        return await Payment.create(data);
    }

    async findAll(): Promise<Payment[]> {
        return await Payment.findAll();
    }

    async findById(id: number): Promise<Payment | null> {
        return await Payment.findByPk(id);
    }

    async update(id: number, data: Partial<PaymentAttributes>): Promise<Payment | null> {
        const payment = await Payment.findByPk(id);

        if (!payment) return null;

        await payment.update(data);
        return payment;
    }

}
