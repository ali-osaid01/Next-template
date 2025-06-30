export interface ApiResponse<T> {
    status: number;
    message?: string;
    success: boolean;
    headers: any
    data: T;
  }
  
  export interface Pagination {
    page: number;
    pageSize: number;
    total: number;
  }
  
  export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: Pagination;
  }
  