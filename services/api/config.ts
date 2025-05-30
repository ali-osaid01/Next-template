import { AxiosApiClient } from './AxiosApiClient';
import { AuthApiAdapter } from './AuthApiAdapter';
import { IAuthService } from './interfaces/IAuthService';
import { ApiBaseUrl } from '../../utils/constant';

const apiClient = new AxiosApiClient(ApiBaseUrl, {
  headers: {
    'Accept': 'application/json',
  },
  timeout: 10000, 
});

export const authService: IAuthService = new AuthApiAdapter(apiClient);

export const services = {
  auth: authService,
} as const;

export type Services = typeof services; 