import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { IApiClient, RequestConfig, ApiResponse } from './interfaces/IApiClient';

export class AxiosApiClient implements IApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string, defaultConfig?: RequestConfig) {
    this.client = axios.create({
      baseURL,
      timeout: defaultConfig?.timeout || 5000,
      headers: {
        'Content-Type': 'application/json',
        ...defaultConfig?.headers,
      },
    });

    
    this.client.interceptors.request.use(
      (config) => {
        // You can add auth tokens, logging, etc. here
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

  
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
         console.log("Unauthorized");
        }
        return Promise.reject(error);
      }
    );
  }

  private transformConfig(config?: RequestConfig): AxiosRequestConfig {
    return {
      headers: config?.headers,
      params: config?.params,
      timeout: config?.timeout,
    };
  }

  private transformResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
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
} 