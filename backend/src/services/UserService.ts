import User, { UserCreationAttributes } from "../models/User";

class UserService {

    async createUser(data: UserCreationAttributes) {
        // Validações básicas
        if (!data.name || !data.email) {
            throw new Error("Nome e email são obrigatórios.");
        }

        const existingUser = await User.findOne({
            where: { email: data.email }
        });

        if (existingUser) {
            throw new Error("Já existe um usuário com este email.");
        }

        const user = await User.create(data);
        return user;
    }

    async getUserById(userId: number) {
        const user = await User.findByPk(userId);

        if (!user) {
            throw new Error("Usuário não encontrado.");
        }

        return user;
    }

    async getAllUsers() {
        return await User.findAll();
    }


    async updateUser(userId: number, data: Partial<UserCreationAttributes>) {
        const user = await User.findByPk(userId);

        if (!user) {
            throw new Error("Usuário não encontrado.");
        }

        if (data.email) {
            const emailInUse = await User.findOne({
                where: { email: data.email }
            });

            if (emailInUse && emailInUse.id !== userId) {
                throw new Error("Email já está em uso por outro usuário.");
            }
        }

        await user.update(data);
        return user;
    }

    async deleteUser(userId: number) {
        const user = await User.findByPk(userId);

        if (!user) {
            throw new Error("Usuário não encontrado.");
        }

        await user.destroy();
        return { message: "Usuário removido com sucesso." };
    }
}

export default new UserService();
