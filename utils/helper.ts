import { setCookie } from "cookies-next/client";

export const getAccessToken = () => {
  const accessToken = localStorage.getItem("access-token");
  return accessToken;
};

export const setAccessToken = (token: string) => {
  localStorage.setItem("access-token", token);
  setCookie("access-token", token);
};

export const removeAccessToken = () => {
  localStorage.removeItem("access-token");
};