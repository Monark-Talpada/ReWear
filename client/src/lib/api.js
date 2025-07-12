import { axiosInstance } from "./axios";

export const authApi = {
  login: async (userData) => {
    const response = await axiosInstance.post("/auth/login", userData);
    return response.data;
  },
  signup: async (data) => {
    const response = await axiosInstance.post("/auth/register", data);
    return response.data;
  },
  getAuthUser: async () => {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  },
};
