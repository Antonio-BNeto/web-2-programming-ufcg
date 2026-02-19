import { Controller, Get, Post, Put, Route, Body, Path, SuccessResponse, Response, Tags } from "tsoa";
import { UserRepository } from '../repository/UserRepository';
import { hashPassword } from '../utils/auth';
import { ErrorResponse, MessageResponse } from "../types/responses";
import {
  CreateUserDTO,
  UpdateUserDTO,
  UserResponseDTO
} from "../dto/user";
const userRepository = new UserRepository();


@Route("users")
@Tags("Usuários")
export class UserController extends Controller {

  @Post()
  @SuccessResponse(201, "Criado com sucesso")
  @Response<ErrorResponse>(500, "Erro interno")
  public async create(
    @Body() requestBody: CreateUserDTO
  ): Promise<UserResponseDTO> {
    try {
      const { password, ...rest } = requestBody;
      const hashedPassword = await hashPassword(password!);

      const user = await userRepository.createUser({
        ...rest,
        password: hashedPassword,
        role: 'USER'
      });

      this.setStatus(201);
      return user as unknown as UserResponseDTO;

    } catch (error: any) {
      this.setStatus(500);
      throw {
        message: "Erro ao criar usuário",
        error: error.message
      };
    }
  }

  @Get()
  public async getAll(): Promise<UserResponseDTO[]> {
    const users = await userRepository.getAllUsers();
    return users as unknown as UserResponseDTO[];
  }

  @Get("{id}")
  @Response<MessageResponse>(404, "Não encontrado")
  public async getById(
    @Path() id: number
  ): Promise<UserResponseDTO> {

    const user = await userRepository.getUserById(id);

    if (!user) {
      this.setStatus(404);
      throw {
        message: "Usuário não encontrado"
      };
    }

    return user as unknown as UserResponseDTO;
  }

  @Put("{id}")
  @Response<MessageResponse>(404, "Não encontrado")
  @Response<ErrorResponse>(500, "Erro interno")
  public async update(
    @Path() id: number,
    @Body() requestBody: UpdateUserDTO
  ): Promise<MessageResponse> {
    try {
      const updated = await userRepository.updateUser(id, requestBody);

      if (!updated) {
        this.setStatus(404);
        throw { message: "Usuário não encontrado ou dados iguais" };
      }

      return { message: "Usuário atualizado com sucesso" };
    } catch (error: any) {
      this.setStatus(500);
      throw {
        message: "Erro ao atualizar usuário",
        error: error.message
      };
    }
  }
}