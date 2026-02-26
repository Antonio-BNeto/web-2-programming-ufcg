import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Route,
  Body,
  Path,
  SuccessResponse,
  Response,
  Tags,
  Query
} from "tsoa";

import { ErrorResponse, MessageResponse } from "../types/responses";
import {
  CreateUserDTO,
  UpdateUserDTO,
  UserResponseDTO
} from "../dto/user";

import UserService from "../services/UserService";
import { PaginatedResponse } from "../dto/shared/PaginatedResponse.dto";

@Route("users")
@Tags("Usuários")
export class UserController extends Controller {

  @Post()
  @SuccessResponse(201, "Criado com sucesso")
  @Response<ErrorResponse>(400, "Erro de validação")
  public async create(
    @Body() requestBody: CreateUserDTO
  ): Promise<UserResponseDTO> {

    try {
      const user = await UserService.createUser(requestBody);

      this.setStatus(201);

      return user.get({ plain: true }) as UserResponseDTO;

    } catch (error: any) {
      this.setStatus(400);
      throw { message: error.message };
    }
  }

  @Get()
  public async getAll(
    @Query() page: number = 1,
    @Query() limit: number = 10
  ): Promise<PaginatedResponse<UserResponseDTO>> {

    return await UserService.getAllUsers(page, limit);
  }

  @Get("{id}")
  @Response<MessageResponse>(404, "Não encontrado")
  public async getById(
    @Path() id: number
  ): Promise<UserResponseDTO> {

    try {
      const user = await UserService.getUserById(id);
      return user.get({ plain: true }) as UserResponseDTO;

    } catch (error: any) {
      this.setStatus(404);
      throw { message: error.message };
    }
  }

  @Put("{id}")
  @Response<MessageResponse>(404, "Não encontrado")
  @Response<ErrorResponse>(400, "Erro de validação")
  public async update(
    @Path() id: number,
    @Body() requestBody: UpdateUserDTO
  ): Promise<UserResponseDTO> {

    try {
      const updated = await UserService.updateUser(id, requestBody);
      return updated.get({ plain: true }) as UserResponseDTO;

    } catch (error: any) {
      this.setStatus(400);
      throw { message: error.message };
    }
  }

  @Delete("{id}")
  @Response<MessageResponse>(404, "Não encontrado")
  public async delete(
    @Path() id: number
  ): Promise<MessageResponse> {

    try {
      return await UserService.deleteUser(id);

    } catch (error: any) {
      this.setStatus(400);
      throw { message: error.message };
    }
  }
}