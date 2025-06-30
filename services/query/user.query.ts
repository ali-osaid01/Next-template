import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '../api/auth.api';
import { AuthUser } from '../interface/auth/auth.interface';
import { ApiResponse } from '../interface';


function useCurrentUser() {
  return useQuery<ApiResponse<AuthUser> | null>({
    queryKey: ['user'],
    queryFn: () => authService.getCurrentUser(),
  });
}

export default useCurrentUser;