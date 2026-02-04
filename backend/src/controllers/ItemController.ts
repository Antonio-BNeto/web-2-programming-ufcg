import { Controller, Get, Post, Put, Delete, Route, Body, Path, SuccessResponse, Response, Tags } from "tsoa";
import ItemRepository from "../repository/ItemRepository";
import { ErrorResponse, MessageResponse } from "../types/responses";

// Interfaces para documentação automática
interface ItemRequest {
  /** @example "Teclado Mecânico" */
  name: string;
  /** @example 250.50 */
  price: number;
}

interface ItemResponse extends ItemRequest {
  id: number;
}

@Route("items")
@Tags("Itens/Produtos")
export class ItemController extends Controller {

  @Post()
  @SuccessResponse(201, "Criado com sucesso")
  public async create(@Body() requestBody: ItemRequest): Promise<ItemResponse | ErrorResponse> {
    try {
      const item = await ItemRepository.create(requestBody);
      this.setStatus(201);
      return item;
    } catch (err: any) {
      this.setStatus(500);
      throw err;
    }
  }

  @Get()
  public async getAll(): Promise<ItemResponse[]> {
    return await ItemRepository.findAll();
  }

  @Get("{id}")
  @Response<MessageResponse>(404, "Não encontrado")
  public async getById(@Path() id: number): Promise<ItemResponse | MessageResponse> {
    const item = await ItemRepository.findById(id);
    if (!item) {
      this.setStatus(404);
      return { message: "Item não encontrado" };
    }
    return item;
  }

  @Put("{id}")
  @Response<MessageResponse>(404, "Não encontrado")
  public async update(@Path() id: number, @Body() requestBody: ItemRequest): Promise<ItemResponse | MessageResponse> {
    const updated = await ItemRepository.update(id, requestBody);
    if (!updated) {
      this.setStatus(404);
      return { message: "Item não encontrado" };
    }
    return updated;
  }

  @Delete("{id}")
  @Response<MessageResponse>(404, "Erro ao deletar")
  public async delete(@Path() id: number): Promise<MessageResponse> {
    const result = await ItemRepository.delete(id);

    if (!result) {
      this.setStatus(404);
      return { message: "Item não encontrado" };
    }

    return { message: "Item deletado com sucesso" };
  }
}