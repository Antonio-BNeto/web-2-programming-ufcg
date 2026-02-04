import { Controller, Get, Post, Put, Route, Body, Path, SuccessResponse, Response, Tags, Security, Request } from "tsoa";
import SaleRepository from "../repository/SaleRepository";
import { ErrorResponse, MessageResponse } from "../types/responses";
import { AuthenticatedRequest } from "../types/auth";
import SaleService from "../services/SaleService";
import Sale from "../models/Sale";
import User from "../models/User";

interface SaleCreateRequest {
  /** @example 250.75 */
  valueTotal: number;
  /** @example "Venda de periféricos gamer" */
  description: string;
  /** Array de itens contendo ID e quantidade */
  items: { itemId: number, quantity: number }[];
}

interface SaleResponse {
  id: number;
  valueTotal: number;
  description: string;
  userId: number;
}

@Route("sales")
@Tags("Vendas")
export class SaleController extends Controller {

  @Post()
  @Security("jwt")
  @SuccessResponse(201, "Venda criada com sucesso")
  public async create(
    @Body() requestBody: { valueTotal: number, description: string, items: { itemId: number, quantity: number }[] },
    @Request() request: AuthenticatedRequest
  ): Promise<SaleResponse | ErrorResponse> {
    try {
      const userId = request.user.id;

      const sale = await SaleService.createSale({
                valueTotal: requestBody.valueTotal,
                description: requestBody.description,
                userId: userId
            }, requestBody.items);

      this.setStatus(201)
      return sale.get({ plain: true }) as SaleResponse;
    } catch (err: any) {
      this.setStatus(err.message.includes("Estoque") ? 400 : 500);
      return { message: "Erro ao criar venda", error: err.message };
    }
  }

  @Get()
@Security("jwt")
public async getAll(@Request() request: AuthenticatedRequest): Promise<any[]> {
  const userId = request.user.id;

  const sales = await Sale.findAll({
    where: { userId },
    include: [{
      model: User,
      as: 'vendedor',
      attributes: ['name', 'email']
    }]
  });

  return sales;
}

  @Get("{id}")
  @Security("jwt")
  @Response<MessageResponse>(404, "Venda não encontrada")
  public async getById(
    @Path() id: number,
    @Request() request: AuthenticatedRequest
  ): Promise<SaleResponse | MessageResponse> {
    try {
      const sale = await SaleService.validateOwnership(id, request.user.id);
      return sale.get({ plain: true }) as SaleResponse;
    } catch (err: any) {
      this.setStatus(404);
      return { message: err.message };
    }
  }

  @Put("{id}")
  @Security("jwt")
  @Response<MessageResponse>(404, "Venda não encontrada ou acesso negado")
  public async update(
    @Path() id: number,
    @Body() requestBody: Partial<Omit<SaleCreateRequest, 'items'>>,
    @Request() request: AuthenticatedRequest
  ): Promise<SaleResponse | MessageResponse> {
    try {
      const userId = request.user.id;

      const updated = await SaleService.updateSale(id, userId, requestBody);

      if (!updated) {
        this.setStatus(404);
        return { message: "Venda não encontrada" };
      }

      return updated.get({ plain: true }) as SaleResponse;
    } catch (err: any) {
      this.setStatus(403);
      return { message: err.message };
    }
  }
}