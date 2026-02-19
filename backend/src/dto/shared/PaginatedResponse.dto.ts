export interface PaginatedResponse<T> {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: T[];
}