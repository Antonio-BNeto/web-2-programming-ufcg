import { Controller, Get, Post, Put, Route, Body, Path, SuccessResponse, Response, Tags, Security, Request, Query } from "tsoa";
import { ErrorResponse, MessageResponse } from "../types/responses";
import { AuthenticatedRequest } from "../types/auth";
import SaleService from "../services/SaleService";
import {
  SaleCreateRequest,
  SaleResponse,
  SaleUpdateRequest,
  SaleDetailResponse
} from "../dto/sale";
import { PaginatedResponse } from "../dto/shared/PaginatedResponse.dto";

@Route("sales")
@Tags("Vendas")
export class SaleController extends Controller {

  @Post()
  @Security("jwt")
  @SuccessResponse(201, "Venda criada com sucesso")
  @Response<ErrorResponse>(400, "Erro de negócio")
  @Response<ErrorResponse>(500, "Erro interno")
  public async create(
    @Body() requestBody: SaleCreateRequest,
    @Request() request: AuthenticatedRequest
  ): Promise<SaleResponse> {
    try {
      const userId = request.user.id;

      const sale = await SaleService.createSale(
        userId,
        requestBody.description,
        requestBody.items
      );

      this.setStatus(201);
      return sale.get({ plain: true }) as SaleResponse;

    } catch (err: any) {
      this.setStatus(err.message.includes("Estoque") ? 400 : 500);
      throw {
        message: "Erro ao criar venda",
        error: err.message
      };
    }
  }

  @Get()
  @Security("jwt")
  public async getAll(
    @Request() request: AuthenticatedRequest,
    @Query() page: number = 1,
    @Query() limit: number = 10
  ): Promise<PaginatedResponse<SaleDetailResponse>> {
    const userId = request.user.id;

    return await SaleService.getSalesPaginated(userId, page, limit);
  }

  @Get("admin/all")
  @Security("jwt", ["ADMIN"])
  public async getAllForAdmin(
    @Query() page: number = 1,
    @Query() limit: number = 10
  ): Promise<PaginatedResponse<SaleDetailResponse>> {
    return await SaleService.getAllSalesPaginatedAdmin(page, limit);
  }

  @Get("{id}")
  @Security("jwt")
  @Response<MessageResponse>(404, "Venda não encontrada")
  public async getById(
    @Path() id: number,
    @Request() request: AuthenticatedRequest
  ): Promise<SaleDetailResponse> {

    try {
      const userId = request.user.id;

      const sale = await SaleService.getSaleById(id, userId);

      return sale.get({ plain: true }) as SaleDetailResponse;

    } catch (err: any) {
      this.setStatus(404);
      throw { message: err.message };
    }
  }

  @Put("{id}")
  @Security("jwt")
  @Response<MessageResponse>(404, "Venda não encontrada ou acesso negado")
  @Response<MessageResponse>(400, "Erro de validação")
  public async update(
    @Path() id: number,
    @Body() requestBody: SaleUpdateRequest,
    @Request() request: AuthenticatedRequest
  ): Promise<SaleResponse> {

    try {
      const userId = request.user.id;

      const updated = await SaleService.updateSale(
        id,
        userId,
        requestBody
      );

      return updated.get({ plain: true }) as SaleResponse;

    } catch (err: any) {

      if (err.message.includes("não encontrada") ||
        err.message.includes("acesso")) {
        this.setStatus(404);
      } else {
        this.setStatus(400);
      }

      throw { message: err.message };
    }
  }
}