import axiosService from "../middleware/axios.middleware";
import Routes from "../routes/routes";

export const login = async (email: string, password: string) => {
  const response = await axiosService.post(Routes.Auth.login, { email, password });
  return response.data;
};