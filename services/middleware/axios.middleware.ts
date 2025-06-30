import { API_URL } from "@/utils/constant";
import { getAccessToken } from "@/utils/helper";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { deleteCookie } from "cookies-next/client";
import { toast } from "sonner";

interface RequestConfig extends AxiosRequestConfig {}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
}

class AxiosService {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = API_URL
    this.client = axios.create({
      baseURL: this.baseURL,
    });
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      async (config) => {
        const accessToken = getAccessToken();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        if (
          error.response &&
          error.response?.data?.statusCode === 401 &&
          error.response?.data?.message === "session expired"
        ) {
          toast.error("Session Expired");
          deleteCookie("access-token");
          window.location.href = "/login";
          return Promise.reject(error);
        } else {
          return Promise.reject(error);
        }
      }
    );
  }

  private transformConfig(config?: RequestConfig): AxiosRequestConfig {
    return config || {};
  }

  private transformResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  }

  async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<T>(url, this.transformConfig(config));
    return this.transformResponse(response);
  }

  async post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<T>(url, data, this.transformConfig(config));
    return this.transformResponse(response);
  }

  async put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<T>(url, data, this.transformConfig(config));
    return this.transformResponse(response);
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<T>(url, this.transformConfig(config));
    return this.transformResponse(response);
  }

  getClient(): AxiosInstance {
    return this.client;
  }

  setBaseURL(url: string): void {
    this.baseURL = url;
    this.client.defaults.baseURL = url;
  }
}

const axiosService = new AxiosService();
export default axiosService;

export { AxiosService };
export type { RequestConfig, ApiResponse };