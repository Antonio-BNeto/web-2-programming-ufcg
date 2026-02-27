import { ItemRequest, ItemResponse } from "../../src/dto/item";

export const mockItemRequest: ItemRequest = {
  name: "Teclado Mecânico",
  description: "Teclado RGB switch blue",
  price: 250.50,
  quantity: 10
};

export const mockItemResponse: ItemResponse = {
  id: 1,
  ...mockItemRequest
};

export const mockItemModel = {
  ...mockItemResponse,
  userId: 1,
  toJSON: () => mockItemResponse
};