import { SaleCreateRequest, SaleResponse, SaleDetailResponse } from "../../src/dto/sale";

export const mockSaleCreateRequest: SaleCreateRequest = {
  description: "Venda de periféricos gamer",
  items: [
    { itemId: 1, quantity: 2 },
    { itemId: 2, quantity: 1 }
  ]
};

export const mockSaleResponse: SaleResponse = {
  id: 1,
  valueTotal: 450.00,
  description: "Venda de periféricos gamer",
  userId: 1
};

export const mockSaleDetailResponse: SaleDetailResponse = {
  ...mockSaleResponse,
  vendedor: {
    name: "Antonio Neto",
    email: "neto@gmail.com"
  },
  itens: [
    {
      id: 1,
      name: "Teclado Mecânico",
      price: 150.0,
      SaleItem: {
        quantity: 2,
        unitPrice: 150.0
      }
    }
  ]
};