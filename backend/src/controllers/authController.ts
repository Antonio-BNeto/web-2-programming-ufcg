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
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  token: string;
}

@Route("auth")
@Tags("Autenticação")
export class AuthController extends Controller {

  @Post("login")
  @SuccessResponse(200, "Login efetuado com sucesso")
  @Response<ErrorResponse>(401, "Credenciais inválidas")
  @Response<ErrorResponse>(500, "Erro interno do servidor")
  public async login(
    @Body() body: LoginRequest
  ): Promise<LoginResponse> {

    const { email, password } = body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new AppError("E-mail ou senha inválidos.", 401);
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("E-mail ou senha inválidos.", 401);
    }

    const token = generateToken(user.id, user.email, user.name, user.email, user.role);

    return {
      message: "Login successful",
      token
    };
  }
}