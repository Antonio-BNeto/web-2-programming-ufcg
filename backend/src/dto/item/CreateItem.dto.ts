import { ItemRequest } from "./ItemRequest.dto";

interface CreateItemDTO extends ItemRequest {
  userId: number;
}