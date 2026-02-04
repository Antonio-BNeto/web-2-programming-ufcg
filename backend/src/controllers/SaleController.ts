import { Controller, Get, Post, Put, Route, Body, Path, SuccessResponse, Response, Tags, Security, Request } from "tsoa";
import { ErrorResponse, MessageResponse } from "../types/responses";
import { AuthenticatedRequest } from "../types/auth";
import SaleService from "../services/SaleService";
import Sale from "../models/Sale";
import User from "../models/User";
import Item from "../models/Item";
import { SaleCreateRequest } from "../dto/Sale.dto";


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
    @Body() requestBody: SaleCreateRequest,
    @Request() request: AuthenticatedRequest
  ): Promise<SaleResponse | ErrorResponse> {
    try {
      const userId = request.user.id;

      const sale = await SaleService.createSale(
        userId,
        requestBody.description,
        requestBody.items);

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
      include: [
        {
          model: User,
          as: 'vendedor',
          attributes: ['name', 'email']
        },
        {
          model: Item,
          as: 'itens', // Nome definido na associação 'as'
          through: { attributes: ['quantity', 'unitPrice'] } // Atributos da tabela intermediária
        }
      ]
    });

    return sales;
  }

  @Get("{id}")
  @Security("jwt")
  @Response<MessageResponse>(404, "Venda não encontrada")
  public async getById(
    @Path() id: number,
    @Request() request: AuthenticatedRequest
  ): Promise<any | MessageResponse> {
    try {
      const sale = await Sale.findOne({
        where: { id, userId: request.user.id },
        include: [{ model: Item, as: 'itens', through: { attributes: ['quantity', 'unitPrice'] } }]
      });

      if (!sale) throw new Error("Venda não encontrada.");

      return sale.get({ plain: true });
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