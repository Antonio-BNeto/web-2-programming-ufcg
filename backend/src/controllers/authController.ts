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

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        this.setStatus(400);
        throw { message: "Invalid email or password" };
      }

      const isPasswordValid = await comparePassword(
        password,
        user.password
      );

      if (!isPasswordValid) {
        this.setStatus(400);
        throw { message: "Invalid email or password" };
      }

      const token = generateToken(user.id, user.email);

      return {
        message: "Login successful",
        token
      };

    } catch (err: any) {

      if (!this.getStatus()) {
        this.setStatus(500);
      }

      throw {
        message: "Error logging in",
        error: err?.message ?? err
      };
    }
  }
}