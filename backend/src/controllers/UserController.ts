import { Request, Response } from 'express';
import { UserRepository } from '../repository/UserRepository';

const userRepository = new UserRepository();

export class UserController {

    async create(req: Request, res: Response) {
        try {
            const { cpf, phoneNumber, name, email, password } = req.body;
            const user = await userRepository.createUser({
                cpf, phoneNumber, name, email, password
            });

            return res.status(201).json(user);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const users = await userRepository.getAllUsers();
            return res.status(200).json(users);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await userRepository.getUserById(Number(id));

            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            return res.status(200).json(user);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const data = req.body;

            const updated = await userRepository.updateUser(Number(id), data);

            if (!updated) {
                return res.status(404).json({ message: 'Usuário não encontrado ou dados iguais' });
            }

            return res.status(200).json({ message: 'Usuário atualizado com sucesso' });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
}