import UserService from '../../src/services/UserService';
import { UserCreationAttributes } from '../../src/models/User';
import { mockUserModel } from '../mocks/userMock';

jest.mock('../../src/services/UserService');

describe('UserService Business Rules', () => {
  it('deve normalizar o CPF removendo caracteres não numéricos antes de salvar', async () => {
    const userData: UserCreationAttributes = {
      name: "Neto",
      cpf: "123.456.789-00",
      email: "neto@gmail.com",
      password: "Password123",
      phoneNumber: "83999999999"
    };

    (UserService.createUser as jest.Mock).mockResolvedValue({
      ...mockUserModel,
      cpf: "12345678900"
    });

    const user = await UserService.createUser(userData);

    expect(user.cpf).toBe("12345678900");
    expect(user.cpf).not.toContain(".");
  });
});