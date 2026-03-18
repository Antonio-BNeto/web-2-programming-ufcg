import { Controller, Get, Post, Put, Delete, Route, Body, Path, SuccessResponse, Response, Tags, Query, Security, Request } from "tsoa";
import { ErrorResponse, MessageResponse } from "../types/responses";
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from "../dto/user";
import UserService from "../services/UserService";
import { PaginatedResponse } from "../dto/shared/PaginatedResponse.dto";
import { AuthenticatedRequest } from "../types/auth";
import { AppError } from "../errors/AppError";

@Route("users")
@Tags("Usuários")
export class UserController extends Controller {
  @Post()
  @SuccessResponse(201, "Criado com sucesso")
  @Response<ErrorResponse>(400, "Erro de validação")
  public async create(
    @Body() requestBody: CreateUserDTO
  ): Promise<UserResponseDTO | ErrorResponse> {
    try {
      const user = await UserService.createUser(requestBody);
      this.setStatus(201);
      return user.get({ plain: true }) as UserResponseDTO;
    } catch (error: any) {
      const status = error.statusCode || error.status || 500;

      this.setStatus(status);

      return {
        message: error.message || "Erro interno do servidor",
      };
    }
  }

  @Get()
  @Security("jwt", ["ADMIN"])
  public async getAll(
    @Query() page: number = 1,
    @Query() limit: number = 10
  ): Promise<PaginatedResponse<UserResponseDTO>> {
    return await UserService.getAllUsers(page, limit);
  }

  @Get("{id}")
  @Security("jwt")
  @Response<MessageResponse>(404, "Não encontrado")
  public async getById(
    @Path() id: number,
    @Request() request: AuthenticatedRequest
  ): Promise<UserResponseDTO> {
    if (request.user.role !== "ADMIN" && request.user.id !== id) {
      throw new AppError("Acesso negado.", 403);
    }
    const user = await UserService.getUserById(id);
    return user.get({ plain: true }) as UserResponseDTO;
  }

  @Put("{id}")
  @Security("jwt")
  @Response<MessageResponse>(404, "Não encontrado")
  @Response<ErrorResponse>(400, "Erro de validação")
  public async update(
    @Path() id: number,
    @Body() requestBody: UpdateUserDTO,
    @Request() request: AuthenticatedRequest
  ): Promise<UserResponseDTO> {
    if (request.user.role !== "ADMIN" && request.user.id !== id) {
      throw new AppError("Acesso negado.", 403);
    }
    const updated = await UserService.updateUser(id, requestBody, request.user.role);
    return updated.get({ plain: true }) as UserResponseDTO;
  }

  @Delete("{id}")
  @Security("jwt", ["ADMIN"])
  @Response<MessageResponse>(404, "Não encontrado")
  public async delete(
    @Path() id: number
  ): Promise<MessageResponse> {
    return await UserService.deleteUser(id);
  }
}