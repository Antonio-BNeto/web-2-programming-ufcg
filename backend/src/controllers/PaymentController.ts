import {
  Controller,
  Get,
  Post,
  Delete,
  Route,
  Tags,
  Security,
  Request,
  Body,
  Path,
  Query,
  SuccessResponse,
  Response
} from "tsoa";

import PaymentService from "../services/PaymentService";
import { PaymentRequest } from "../dto/payment/PaymentRequest.dto";
import { PaymentResponse } from "../dto/payment/PaymentResponse.dto";
import { PaginatedResponse } from "../dto/shared/PaginatedResponse.dto";
import { MessageResponse, ErrorResponse } from "../types/responses";
import { AuthenticatedRequest } from "../types/auth";

@Route("payments")
@Tags("Pagamentos")
export class PaymentController extends Controller {

  @Get()
  @Security("jwt")
  public async getAll(
    @Request() request: AuthenticatedRequest,
    @Query() page: number = 1,
    @Query() limit: number = 10
  ): Promise<PaginatedResponse<PaymentResponse>> {

    return PaymentService.getPaymentsPaginated(
      request.user.id,
      request.user.role === "ADMIN",
      page,
      limit
    );
  }

  @Get("{id}")
  @Security("jwt")
  @Response<ErrorResponse>(404, "Pagamento não encontrado")
  public async getById(
    @Path() id: number,
    @Request() request: AuthenticatedRequest
  ): Promise<PaymentResponse> {

    return await PaymentService.getPaymentById(
      id,
      request.user.id,
      request.user.role === "ADMIN"
    );
  }

  @Post()
  @Security("jwt")
  @SuccessResponse(201, "Pagamento criado com sucesso")
  @Response<ErrorResponse>(400, "Erro de validação")
  public async create(
    @Body() requestBody: PaymentRequest,
    @Request() request: AuthenticatedRequest
  ): Promise<PaymentResponse> {

    const payment = await PaymentService.createPayment(
      requestBody,
      request.user.id
    );

    this.setStatus(201);
    return payment;
  }

  @Delete("{id}")
  @Security("jwt")
  @Response<ErrorResponse>(404, "Pagamento não encontrado")
  public async delete(
    @Path() id: number,
    @Request() request: AuthenticatedRequest
  ): Promise<MessageResponse> {

    return await PaymentService.deletePayment(
      id,
      request.user.id,
      request.user.role === "ADMIN"
    );
  }
}