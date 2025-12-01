import { where } from "sequelize";
import { User, UserCreationAttributes } from "../models/User";

export class UserRepository {

  async createUser(data: UserCreationAttributes) {
    const user = await User.create(data);

    return user;
  }

  async getAllUsers() {
    return await User.findAll();
  }

  async getUserById(id: number){
    return await User.findByPk(id);
  }

  async updateUser(id:number, data: Partial<UserCreationAttributes>) {
    const [affectedCount] = await User.update(data ,{
      where: { id }
    });

    return affectedCount > 0;
  }

  async deleteUser(id:number) {
    const deletedCount = await User.destroy({
      where: { id }
    });

    return deletedCount > 0;
  }

}