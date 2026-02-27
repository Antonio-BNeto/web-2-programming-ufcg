import { ItemRequest } from "./ItemRequest.dto";

export interface ItemResponse extends ItemRequest {
  id: number;
}