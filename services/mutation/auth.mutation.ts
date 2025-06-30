import { useMutation } from '@tanstack/react-query';
import { authService } from '../api/auth.api';
import { AuthUser, LoginPayload, RegisterPayload } from '../interface/auth/auth.interface';

function useLogin() {
  return useMutation<AuthUser, Error, LoginPayload>({
    mutationFn: async (credentials: LoginPayload) => {
      const response = await authService.login(credentials);
      return response.data;
    },
    onSuccess: (user: AuthUser) => {
      console.log(user);
    },
  });
}

function useRegister() {
  return useMutation<AuthUser, Error, RegisterPayload>({
    mutationFn: async (data: RegisterPayload) => {
      const response = await authService.register(data);
      return response.data;
    },
    onSuccess: (user: AuthUser) => {
      console.log(user);
    },
  });
}

function useLogout() {
  return useMutation<void, Error, void>({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      console.log('logout');
    },
  });
}

function useRefreshToken() {
  return useMutation<AuthUser, Error, void>({
    mutationFn: async () => {
      const response = await authService.refreshToken();
      return response.data;
    },
    onSuccess: (user: AuthUser) => {
      console.log(user);
    },
  });
}

class AuthMutation {
  static useLogin = useLogin;
  static useRegister = useRegister;
  static useLogout = useLogout;
  static useRefreshToken = useRefreshToken;
}

export default new AuthMutation();