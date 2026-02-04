import { Controller, Get, Post, Put, Route, Body, Path, SuccessResponse, Response, Tags } from "tsoa";
import SaleRepository from "../repository/SaleRepository";
import { ErrorResponse, MessageResponse } from "../types/responses";

// Interfaces baseadas no seu SaleAttributes
interface SaleRequest {
  /** @example 250.75 */
  valueTotal: number;
  /** @example "Venda de periféricos gamer" */
  description: string;
  /** @example 1 */
  userId: number;
}

interface SaleResponse extends SaleRequest {
  id: number;
}

@Route("sales")
@Tags("Vendas")
export class SaleController extends Controller {

  @Post()
  @SuccessResponse(201, "Venda criada com sucesso")
  public async create(@Body() requestBody: SaleRequest): Promise<SaleResponse | ErrorResponse> {
    try {
      const sale = await SaleRepository.create(requestBody);
      this.setStatus(201);
      return sale as unknown as SaleResponse;
    } catch (err: any) {
      this.setStatus(500);
      return { message: "Erro ao criar venda", error: err.message };
    }
  }

  @Get()
  public async getAll(): Promise<SaleResponse[]> {
    const sales = await SaleRepository.findAll();
    return sales as unknown as SaleResponse[];
  }

  @Get("{id}")
  @Response<MessageResponse>(404, "Venda não encontrada")
  public async getById(@Path() id: number): Promise<SaleResponse | MessageResponse> {
    const sale = await SaleRepository.findById(id);
    if (!sale) {
      this.setStatus(404);
      return { message: "Venda não encontrada" };
    }
    return sale as unknown as SaleResponse;
  }

  @Put("{id}")
  @Response<MessageResponse>(404, "Venda não encontrada")
  public async update(@Path() id: number, @Body() requestBody: SaleRequest): Promise<SaleResponse | MessageResponse> {
    const updated = await SaleRepository.update(id, requestBody);
    if (!updated) {
      this.setStatus(404);
      return { message: "Venda não encontrada" };
    }
    return updated as unknown as SaleResponse;
  }
}