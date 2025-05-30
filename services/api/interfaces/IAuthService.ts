export interface AuthUser {
  id: string;
  email: string;
  name: string;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<AuthUser>;
  register(data: RegisterData): Promise<AuthUser>;
  logout(): Promise<void>;
  refreshToken(): Promise<AuthUser>;
  getCurrentUser(): AuthUser | null;
  isAuthenticated(): boolean;
} 