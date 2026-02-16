import type { ApiRequestConfig } from "@/types/api.types";
import type { BaseApiResponse } from "@/types/common.types";
import { getToken, removeToken } from "../helpers/tokenHelper";
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";
import router from "@/router";

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    const customConfig = config as InternalAxiosRequestConfig &
      ApiRequestConfig;

    if (token && !customConfig.skipAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Jika response status false, treat as error
    const data = response.data as BaseApiResponse;
    if (data && data.status === false) {
      return Promise.reject({
        response: {
          data,
          status: response.status,
        },
      });
    }
    return response;
  },
  (error: AxiosError<BaseApiResponse>) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      removeToken();
      router.push({ name: "Login" });
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network Error:", error.message);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
