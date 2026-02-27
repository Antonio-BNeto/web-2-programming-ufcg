import { Controller, Route, Tags, Post, Body, Request, Security, Get, Delete, Path, SuccessResponse, Response } from "tsoa";
import PaymentMethodService from "../services/PaymentMethodService";
import { AuthenticatedRequest } from "../types/auth";
import { MessageResponse, ErrorResponse } from "../types/responses";
import { CreatePaymentMethodRequest } from "../dto/paymentMethod/PaymentMethodRequest.dto";
import { PaymentMethodResponse } from "../dto/paymentMethod/PaymentMethodResponse.dto";

@Route("payment-methods")
@Tags("Métodos de Pagamento")
export class PaymentMethodController extends Controller {

  @Post()
  @Security("jwt")
  @SuccessResponse(201, "Criado com sucesso")
  public async create(
    @Body() body: CreatePaymentMethodRequest,
    @Request() request: AuthenticatedRequest
  ): Promise<PaymentMethodResponse> {
    const result = await PaymentMethodService.createPaymentMethod(request.user.id, body.type, body);
    this.setStatus(201);
    return result;
  }

  @Get()
  @Security("jwt")
  public async getUserMethods(
    @Request() request: AuthenticatedRequest
  ): Promise<PaymentMethodResponse[]> {
    return await PaymentMethodService.getUserPaymentMethods(request.user.id);
  }

  @Get("{id}")
  @Security("jwt")
  @Response<ErrorResponse>(404, "Não encontrado")
  public async getById(
    @Path() id: number,
    @Request() request: AuthenticatedRequest
  ): Promise<PaymentMethodResponse> {
    const method = await PaymentMethodService.getPaymentMethodById(id);
    if (method.userId !== request.user.id) {
      this.setStatus(403);
      throw new Error("Acesso negado");
    }
    return method;
  }

  @Delete("{id}")
  @Security("jwt")
  @Response<ErrorResponse>(404, "Não encontrado")
  public async delete(
    @Path() id: number,
    @Request() request: AuthenticatedRequest
  ): Promise<MessageResponse> {
    return await PaymentMethodService.deletePaymentMethod(id, request.user.id);
  }
}