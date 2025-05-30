import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IAuthService, LoginCredentials, RegisterData, AuthUser } from '../interfaces/IAuthService';
import { authService } from '../config';

export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  login: () => [...authKeys.all, 'login'] as const,
  register: () => [...authKeys.all, 'register'] as const,
};

export function useCurrentUser() {
  return useQuery<AuthUser | null>({
    queryKey: authKeys.user(),
    queryFn: () => authService.getCurrentUser(),
    staleTime: 1000 * 60 * 5, 
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<AuthUser, Error, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (user: AuthUser) => {
      // Update the user query cache
      queryClient.setQueryData(authKeys.user(), user);
      // Invalidate any queries that depend on auth state
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation<AuthUser, Error, RegisterData>({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (user: AuthUser) => {
      queryClient.setQueryData(authKeys.user(), user);
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}

export function useRefreshToken() {
  const queryClient = useQueryClient();

  return useMutation<AuthUser, Error, void>({
    mutationFn: () => authService.refreshToken(),
    onSuccess: (user: AuthUser) => {
      queryClient.setQueryData(authKeys.user(), user);
    },
  });
} 