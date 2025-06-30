class Routes {
   
    static Auth = {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      refreshToken: '/auth/refresh',
    };
  
    static Users = {
      list: (params?: { page?: number; limit?: number; search?: string }) => this.withQueryParams('/users', params),
      profile: (userId: string) => `/users/${userId}`,
      updateProfile: (userId: string) => `/users/${userId}`,
    };
  
    private static withQueryParams(
        path: string,
        params?: Record<string, any>
      ): string {
        if (!params) return path;
    
        const searchParams = new URLSearchParams();
    
        for (const [key, value] of Object.entries(params)) {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        }
    
        const queryString = searchParams.toString();
        return queryString ? `${path}?${queryString}` : path;
      }
  }
  
  export default Routes;
  