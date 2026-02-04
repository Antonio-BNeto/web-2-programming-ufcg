import { Controller, Get, Post, Put, Route, Body, Path, SuccessResponse, Response, Tags } from "tsoa";
import { PaymentRepository } from "../repository/PaymentRepository";
import { ErrorResponse, MessageResponse } from "../types/responses";

const repository = new PaymentRepository();

interface PaymentRequest {
  /** @example 1 */
  saleId: number;
  /** @example "PENDING" */
  status: string;
  /** @example 150.50 */
  value: number;
  /** @example "2026-02-03T23:00:00Z" */
  paymentDate?: Date | null;
}

interface PaymentResponse extends PaymentRequest {
  id: number;
}

@Route("payments")
@Tags("Pagamentos")
export class PaymentController extends Controller {

  @Post()
  @SuccessResponse(201, "Criado com sucesso")
  @Response<ErrorResponse>(400, "Falha na criação")
  public async create(@Body() requestBody: PaymentRequest): Promise<PaymentResponse | ErrorResponse | MessageResponse> {
    try {
      const payment = await repository.create(requestBody);
      this.setStatus(201);
      return payment as unknown as PaymentResponse;
    } catch (error) {
      this.setStatus(400);
      return { message: "Failed to create payment", error };
    }
  }

  @Get()
  public async findAll(): Promise<PaymentResponse[]> {
    const payments = await repository.findAll();
    return payments as unknown as PaymentResponse[];
  }

  @Get("{id}")
  @Response<ErrorResponse>(404, "Não encontrado")
  public async findById(@Path() id: number): Promise<PaymentResponse | ErrorResponse> {
    const payment = await repository.findById(id);
    if (!payment) {
      this.setStatus(404);
      return { message: "Payment not found" };
    }
    return payment as unknown as PaymentResponse;
  }

  @Put("{id}")
  @SuccessResponse(200, "Atualizado com sucesso")
  @Response<ErrorResponse>(404, "Não encontrado")
  @Response<ErrorResponse>(400, "Erro na atualização")
  public async update(
    @Path() id: number,
    @Body() requestBody: PaymentRequest
  ): Promise<PaymentResponse | ErrorResponse> {
    try {
      const updated = await repository.update(id, requestBody);
      if (!updated) {
        this.setStatus(404);
        return { message: "Pagamento não encontrado" };
      }
      return updated as unknown as PaymentResponse;
    } catch (error) {
      this.setStatus(400);
      return { message: "Falha na atualização do pagamento", error };
    }
  }
}