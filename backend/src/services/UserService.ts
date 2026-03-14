import bcrypt from "bcryptjs";
import User, { UserCreationAttributes } from "../models/User";
import Sale from "../models/Sale";
import { paginate } from "../utils/pagination";
import { AppError } from "../errors/AppError";

class UserService {

  private normalizeCpf(cpf: string): string {
    return cpf.replace(/\D/g, "");
  }

  private isValidCPF(cpf: string): boolean {
    cpf = this.normalizeCpf(cpf);

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++)
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++)
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;

    return remainder === parseInt(cpf.substring(10, 11));
  }

  private validatePassword(password: string) {
    if (password.length < 8)
      throw new AppError("Senha deve ter no mínimo 8 caracteres.", 400);
    if (!/[A-Z]/.test(password))
      throw new AppError("Senha deve conter ao menos uma letra maiúscula.", 400);
    if (!/[0-9]/.test(password))
      throw new AppError("Senha deve conter ao menos um número.", 400);
  }

  async createUser(data: UserCreationAttributes) {
    if (!data.name || !data.email || !data.password || !data.cpf || !data.phoneNumber)
      throw new AppError("Todos os campos obrigatórios devem ser informados.", 400);

    data.email = data.email.toLowerCase();
    data.cpf = this.normalizeCpf(data.cpf);

    if (!this.isValidCPF(data.cpf))
      throw new AppError("CPF inválido.", 400);

    if (!/^\d{10,11}$/.test(data.phoneNumber))
      throw new AppError("Telefone deve conter 10 ou 11 dígitos numéricos.", 400);

    const emailExists = await User.findOne({ where: { email: data.email } });
    if (emailExists) throw new AppError("Email já cadastrado.", 409);

    const cpfExists = await User.findOne({ where: { cpf: data.cpf } });
    if (cpfExists) throw new AppError("CPF já cadastrado.", 409);

    this.validatePassword(data.password);
    data.password = await bcrypt.hash(data.password, 10);

    return await User.create(data);
  }

  async getUserById(userId: number) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] }
    });
    if (!user) throw new AppError("Usuário não encontrado.", 404);
    return user;
  }

  async getAllUsers(page: number = 1, limit: number = 10) {
    if (page <= 0 || limit <= 0)
      throw new AppError("Parâmetros de paginação inválidos.", 400);

    return await paginate(User, page, limit, {
      attributes: { exclude: ["password"] },
      order: [["id", "ASC"]]
    });
  }

  async updateUser(
    userId: number,
    data: Partial<UserCreationAttributes>,
    requesterRole?: "USER" | "ADMIN"
  ) {
    const user = await User.findByPk(userId);
    if (!user) throw new AppError("Usuário não encontrado.", 404);

    if (data.cpf) throw new AppError("CPF não pode ser alterado.", 400);

    if (data.email) {
      data.email = data.email.toLowerCase();
      const emailInUse = await User.findOne({ where: { email: data.email } });
      if (emailInUse && emailInUse.id !== userId)
        throw new AppError("Email já está em uso.", 409);
    }

    if (data.role && requesterRole !== "ADMIN")
      throw new AppError("Apenas ADMIN pode alterar permissões.", 403);

    if (data.password) {
      this.validatePassword(data.password);
      data.password = await bcrypt.hash(data.password, 10);
    }

    await user.update(data);
    return await this.getUserById(userId);
  }

  async deleteUser(userId: number) {
    const user = await User.findByPk(userId);
    if (!user) throw new AppError("Usuário não encontrado.", 404);

    const sales = await Sale.count({ where: { userId } });
    if (sales > 0) throw new AppError("Usuário possui vendas vinculadas.", 400);

    if (user.role === "ADMIN") {
      const adminCount = await User.count({ where: { role: "ADMIN" } });
      if (adminCount <= 1)
        throw new AppError("O sistema deve ter pelo menos um ADMIN.", 400);
    }

    await user.destroy();
    return { message: "Usuário removido com sucesso." };
  }
}

export default new UserService();