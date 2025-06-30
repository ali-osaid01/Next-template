import { ApiResponse } from "../interface";
import { AuthUser, LoginPayload, RegisterPayload } from "../interface/auth/auth.interface";
import axiosService from "../middleware/axios.middleware";
import Routes from "../routes/routes";

class AuthApiService  {

  async login(credentials: LoginPayload): Promise<ApiResponse<AuthUser>> {
    const { data } = await axiosService.post<ApiResponse<AuthUser>>(Routes.Auth.login, credentials);
    return data;
  }

  async register(payload: RegisterPayload): Promise<ApiResponse<AuthUser>> {
    const { data } = await axiosService.post<ApiResponse<AuthUser>>(Routes.Auth.register, payload);
    return data;
  }

  async logout(): Promise<void> {
    await axiosService.post<void>(Routes.Auth.logout);
  }

  async refreshToken(): Promise<ApiResponse<AuthUser>> {
    const { data } = await axiosService.post<ApiResponse<AuthUser>>(Routes.Auth.refreshToken);
    return data;
  }

  async getCurrentUser(): Promise<ApiResponse<AuthUser>> {
      const { data } = await axiosService.get<ApiResponse<AuthUser>>(Routes.Auth.me);
      return data;
  }
}

export const authService = new AuthApiService();
