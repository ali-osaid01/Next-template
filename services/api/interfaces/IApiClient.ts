export interface IApiClient {
  get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>>;
  put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>>;
  delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  timeout?: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
} 