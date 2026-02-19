import { Controller, Get, Post, Put, Route, Body, Path, SuccessResponse, Response, Tags, Security, Request, Query } from "tsoa";
import { ErrorResponse, MessageResponse } from "../types/responses";
import { AuthenticatedRequest } from "../types/auth";
import { PaymentRequest} from "../dto/payment/PaymentRequest.dto";
import { PaginatedResponse } from "../dto/shared/PaginatedResponse.dto";
import PaymentService from "../services/PaymentService";
import { PaymentResponse } from "../dto/payment/PaymentResponse.dto";

@Route("payments")
@Tags("Pagamentos")
@Security("jwt")
export class PaymentController extends Controller {

  @Post()
  @SuccessResponse(201, "Criado com sucesso")
  public async create(
    @Body() requestBody: PaymentRequest,
    @Request() request: AuthenticatedRequest
  ): Promise<PaymentResponse | ErrorResponse> {
    try {

      const payment = await PaymentService.createPayment(requestBody);
      this.setStatus(201);
      return payment.get({ plain: true }) as PaymentResponse;
    } catch (error: any) {
      this.setStatus(400);
      return { message: "Erro ao criar pagamento", error: error.message };
    }
  }

  @Get()
  public async findAll(
    @Request() request: AuthenticatedRequest,
    @Query() page: number = 1,
    @Query() limit: number = 10
  ): Promise<PaginatedResponse<PaymentResponse>> {
    const userId = request.user.id;
    const isAdmin = request.user. === 'ADMIN';

    const result = await PaymentService.getPaymentsPaginated(userId, isAdmin, page, limit);
    
    return {
      ...result,
      items: result.items.map(p => p.get({ plain: true })) as PaymentResponse[]
    };
  }

  @Get("{id}")
  @Response<MessageResponse>(404, "Não encontrado")
  public async findById(
    @Path() id: number,
    @Request() request: AuthenticatedRequest
  ): Promise<PaymentResponse | MessageResponse> {
    try {
      const userId = request.user.id;
      const isAdmin = request.user.role === 'ADMIN';

      const payment = await PaymentService.getPaymentById(id, userId, isAdmin);
      return payment.get({ plain: true }) as PaymentResponse;
    } catch (error: any) {
      this.setStatus(404);
      return { message: error.message };
    }
  }
}