import { IAuthService, AuthUser, LoginCredentials, RegisterData } from './interfaces/IAuthService';
import { AxiosApiClient } from './AxiosApiClient';

export class AuthApiAdapter implements IAuthService {
  private static readonly TOKEN_KEY = 'auth_user';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private currentUser: AuthUser | null = null;

  constructor(private apiClient: AxiosApiClient) {
    this.restoreSession();
  }

  private restoreSession(): void {
    const storedUser = localStorage.getItem(AuthApiAdapter.TOKEN_KEY);
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
      } catch (error) {
        console.error('Failed to restore user session:', error);
        this.clearSession();
      }
    }
  }

  private saveSession(user: AuthUser): void {
    this.currentUser = user;
    localStorage.setItem(AuthApiAdapter.TOKEN_KEY, JSON.stringify(user));
    localStorage.setItem(AuthApiAdapter.REFRESH_TOKEN_KEY, user.refreshToken);
  }

  private clearSession(): void {
    this.currentUser = null;
    localStorage.removeItem(AuthApiAdapter.TOKEN_KEY);
    localStorage.removeItem(AuthApiAdapter.REFRESH_TOKEN_KEY);
  }

  async login(credentials: LoginCredentials): Promise<AuthUser> {
    try {
      const response = await this.apiClient.post<AuthUser>('/auth/login', credentials);
      const user = response.data;
      this.saveSession(user);
      return user;
    } catch (error) {
      throw new Error('Login failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async register(data: RegisterData): Promise<AuthUser> {
    try {
      const response = await this.apiClient.post<AuthUser>('/auth/register', data);
      const user = response.data;
      this.saveSession(user);
      return user;
    } catch (error) {
      throw new Error('Registration failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.currentUser) {
        await this.apiClient.post('/auth/logout', {
          refreshToken: this.currentUser.refreshToken
        });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      this.clearSession();
    }
  }

  async refreshToken(): Promise<AuthUser> {
    try {
      const refreshToken = localStorage.getItem(AuthApiAdapter.REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await this.apiClient.post<AuthUser>('/auth/refresh', {
        refreshToken
      });

      const user = response.data;
      this.saveSession(user);
      return user;
    } catch (error) {
      this.clearSession();
      throw new Error('Token refresh failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }
} 