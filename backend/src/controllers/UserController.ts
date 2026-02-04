import { Controller, Get, Post, Put, Route, Body, Path, SuccessResponse, Response, Tags } from "tsoa";
import { UserRepository } from '../repository/UserRepository';
import { hashPassword } from '../utils/auth';
import { ErrorResponse, MessageResponse } from "../types/responses";

const userRepository = new UserRepository();

// Interfaces para documentação e prototipagem
interface UserRequest {
  /** @example "123.456.789-00" */
  cpf: string;
  /** @example "(83) 99999-9999" */
  phoneNumber: string;
  /** @example "Usuário" */
  name: string;
  /** @example "usuario@email.com" */
  email: string;
  /** @example "senhaSegura123" */
  password?: string;
}

interface UserResponse extends Omit<UserRequest, 'password'> {
  id: number;
}

@Route("users")
@Tags("Usuários")
export class UserController extends Controller {

  @Post()
  @SuccessResponse(201, "Criado com sucesso")
  public async create(@Body() requestBody: UserRequest): Promise<UserResponse | ErrorResponse> {
    try {
      const { password, ...rest } = requestBody;
      const hashedPassword = await hashPassword(password!);

      const user = await userRepository.createUser({
        ...rest,
        password: hashedPassword
      });

      this.setStatus(201);
      return user as unknown as UserResponse;
    } catch (error: any) {
      this.setStatus(500);
      return { message: "Erro ao criar usuário", error: error.message };
    }
  }

  @Get()
  public async getAll(): Promise<UserResponse[]> {
    const users = await userRepository.getAllUsers();
    return users as unknown as UserResponse[];
  }

  @Get("{id}")
  @Response<MessageResponse>(404, "Não encontrado")
  public async getById(@Path() id: number): Promise<UserResponse | MessageResponse> {
    const user = await userRepository.getUserById(id);
    if (!user) {
      this.setStatus(404);
      return { message: "Usuário não encontrado" };
    }
    return user as unknown as UserResponse;
  }

  @Put("{id}")
  @Response<MessageResponse>(404, "Não encontrado")
  public async update(@Path() id: number, @Body() requestBody: Partial<UserRequest>): Promise<MessageResponse | ErrorResponse> {
    try {
      const updated = await userRepository.updateUser(id, requestBody);

      if (!updated) {
        this.setStatus(404);
        return { message: "Usuário não encontrado ou dados iguais" };
      }

      return { message: "Usuário atualizado com sucesso" };
    } catch (error: any) {
      this.setStatus(500);
      return { message: "Erro ao atualizar usuário", error: error.message };
    }
  }
}