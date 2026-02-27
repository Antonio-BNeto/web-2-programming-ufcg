import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Route,
  Body,
  Path,
  SuccessResponse,
  Response,
  Tags,
  Security,
  Query,
  Request
} from "tsoa";

import ItemService from "../services/ItemService";
import { ErrorResponse, MessageResponse } from "../types/responses";
import { PaginatedResponse } from "../dto/shared/PaginatedResponse.dto";
import { ItemRequest, ItemResponse } from "../dto/item";
import { AuthenticatedRequest } from "../types/auth";

@Route("items")
@Tags("Itens")
export class ItemController extends Controller {

  @Post()
  @Security("jwt")
  @SuccessResponse(201, "Criado com sucesso")
  @Response<ErrorResponse>(400, "Erro de validação")
  public async create(
    @Body() requestBody: ItemRequest,
    @Request() request: AuthenticatedRequest
  ): Promise<ItemResponse> {

    const item = await ItemService.createItem(
      request.user.id,
      requestBody,
    );
    this.setStatus(201);
    return item.toJSON() as ItemResponse;
  }

  @Get()
  public async getAll(
    @Query() page: number = 1,
    @Query() limit: number = 10
  ): Promise<PaginatedResponse<ItemResponse>> {

    const result = await ItemService.getAllItems(page, limit);

    return {
      totalItems: result.total,
      totalPages: result.totalPages,
      currentPage: result.page,
      items: result.items.map(item =>
        item.toJSON()
      ) as ItemResponse[]
    };
  }

  @Get("{id}")
  @Response<MessageResponse>(404, "Não encontrado")
  public async getById(
    @Path() id: number
  ): Promise<ItemResponse> {

    const item = await ItemService.getItemById(id);
    return item.toJSON() as ItemResponse;
  }

  @Put("{id}")
  @Security("jwt")
  public async update(
    @Path() id: number,
    @Body() requestBody: Partial<ItemRequest>,
    @Request() request: AuthenticatedRequest
  ): Promise<ItemResponse> {

    const updated = await ItemService.updateItem(
      id,
      request.user.id,
      requestBody
    );

    return updated.toJSON() as ItemResponse;
  }

  @Delete("{id}")
  @Security("jwt")
  public async delete(
    @Path() id: number,
    @Request() request: AuthenticatedRequest
  ): Promise<MessageResponse> {

    await ItemService.deleteItem(id, request.user.id);

    return { message: "Item deletado com sucesso" };
  }
}