import User from "../models/User";
import bcrypt from "bcryptjs";

export async function createDefaultAdmin() {
  const {
    ADMIN_DEFAULT_NAME,
    ADMIN_DEFAULT_EMAIL,
    ADMIN_DEFAULT_PASSWORD,
    ADMIN_DEFAULT_CPF,
    ADMIN_DEFAULT_PHONE
  } = process.env;

  if (!ADMIN_DEFAULT_EMAIL || !ADMIN_DEFAULT_PASSWORD || !ADMIN_DEFAULT_CPF) {
    console.warn("⚠️ Variáveis de ambiente para o Admin padrão não configuradas. Pulando criação.");
    return;
  }

  const adminExists = await User.findOne({ where: { email: ADMIN_DEFAULT_EMAIL } });

  if (!adminExists) {

    const hashedPassword = await bcrypt.hash(ADMIN_DEFAULT_PASSWORD, 10);

    await User.create({
      name: ADMIN_DEFAULT_NAME || "Admin",
      email: ADMIN_DEFAULT_EMAIL,
      password: hashedPassword,
      cpf: ADMIN_DEFAULT_CPF,
      phoneNumber: ADMIN_DEFAULT_PHONE || "00000000000",
      role: 'ADMIN'
    });
  }
}