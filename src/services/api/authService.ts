import type { AxiosResponse } from "axios";
import apiClient from "./axiosInstance";
import type {
  LoginRequest,
  LoginResponse,
  UserResponse,
  UpdateProfileRequest,
} from "@/types/auth.types";
import type { BaseApiResponse } from "@/types/common.types";

export default {
  login(
    credentials: LoginRequest,
  ): Promise<AxiosResponse<BaseApiResponse<LoginResponse>>> {
    return apiClient.post<BaseApiResponse<LoginResponse>>(
      "/auth/login",
      credentials,
    );
  },

  logout(): Promise<AxiosResponse<BaseApiResponse<void>>> {
    return apiClient.post<BaseApiResponse<void>>("/auth/logout");
  },

  getProfile(): Promise<AxiosResponse<BaseApiResponse<UserResponse>>> {
    return apiClient.get<BaseApiResponse<UserResponse>>("/users/profile");
  },

  updateProfile(
    payload: UpdateProfileRequest,
  ): Promise<AxiosResponse<BaseApiResponse<UserResponse>>> {
    return apiClient.put<BaseApiResponse<UserResponse>>(
      "/users/profile",
      payload,
    );
  },
};
