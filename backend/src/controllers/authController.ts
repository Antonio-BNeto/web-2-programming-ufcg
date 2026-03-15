import {
  Controller,
  Post,
  Route,
  Body,
  SuccessResponse,
  Response,
  Tags
} from "tsoa";

import { comparePassword, generateToken } from "../utils/auth";
import User from "../models/User";
import { ErrorResponse } from "../types/responses";
import { AppError } from "../errors/AppError";

interface LoginRequest {
  /** @example "usuario@email.com" */
  email: string;

  /** @example "senhaSegura123" */
  password: string;
}

interface LoginResponse {
  message: string;
  token: string;
}

@Route("auth")
@Tags("Autenticação")
export class AuthController extends Controller {

  /**
   * Realiza a autenticação do usuário e retorna um token JWT.
   */
  @Post("login")
  @SuccessResponse(200, "Login efetuado com sucesso")
  @Response<ErrorResponse>(400, "Credenciais inválidas")
  @Response<ErrorResponse>(500, "Erro interno do servidor")
  public async login(
    @Body() body: LoginRequest
  ): Promise<LoginResponse> {

    const { email, password } = body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new AppError("E-mail ou senha inválidos.", 400);
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("E-mail ou senha inválidos.", 400);
    }

    const token = generateToken(user.id, user.email);

    return {
      message: "Login successful",
      token
    };
  }
}