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

    const userId = request.user.id;

    const sale = await SaleService.createSale(
      userId,
      requestBody.description,
      requestBody.items
    );

    this.setStatus(201);
    return sale;
  }

  @Get()
  @Security("jwt")
  public async getAll(
    @Request() request: AuthenticatedRequest,
    @Query() page: number = 1,
    @Query() limit: number = 10
  ): Promise<PaginatedResponse<SaleDetailResponse>> {

    return await SaleService.getSalesPaginated(
      request.user.id,
      page,
      limit
    );
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

    return await SaleService.getSaleById(id, request.user.id);
  }

  @Get("user/{userId}")
  @Security("jwt")
  public async getAllByUser(
    @Path() userId: number,
    @Request() request: AuthenticatedRequest,
    @Query() page: number = 1,
    @Query() limit: number = 10
  ): Promise<PaginatedResponse<SaleDetailResponse>> {

    if (
      request.user.role !== "ADMIN" &&
      request.user.id !== userId
    ) {
      this.setStatus(403);
      throw { message: "Acesso negado." };
    }

    return await SaleService.getSalesPaginated(
      userId,
      page,
      limit
    );
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

    return await SaleService.updateSale(
      id,
      request.user.id,
      requestBody
    );
  }
}