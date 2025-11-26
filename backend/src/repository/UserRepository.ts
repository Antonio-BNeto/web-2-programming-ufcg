import { User } from "../models/User";

export class UserRepository {
    async createUser(name: string, cpf: string, phoneNumber:string, email: string, password:string) {
        const user = await User.create({
            name,
            cpf,
            phoneNumber,
            email,
            password
        });
        
        return user;
    }

    async getAllUsers() {
        return await User.findAll();
    }
}