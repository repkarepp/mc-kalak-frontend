import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  UserResponse,
  LoginRequest,
  UpdateProfileRequest,
} from "@/types/auth.types";
import type { BaseApiResponse } from "@/types/common.types";
import authService from "@/services/api/authService";
import {
  getToken,
  setToken,
  removeToken,
} from "@/services/helpers/tokenHelper";

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref<UserResponse | null>(null);
  const token = ref<string | null>(getToken());
  const isAuthenticated = ref<boolean>(!!getToken());
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // Getters
  const currentUser = computed(() => user.value);
  const isLoggedIn = computed(() => isAuthenticated.value);
  const userId = computed(() => user.value?.id ?? null);
  const username = computed(() => user.value?.username ?? "User");
  const avatarUrl = computed(() => user.value?.avatar_url ?? "");
  const isActive = computed(() => user.value?.is_active ?? false);

  // Actions
  async function login(credentials: LoginRequest) {
    loading.value = true;
    error.value = null;

    try {
      const response = await authService.login(credentials);
      const authToken = response.data.data.token;

      token.value = authToken;
      isAuthenticated.value = true;
      setToken(authToken);

      // PENTING: Fetch user profile setelah login
      await fetchUserProfile();

      return { success: true };
    } catch (err: any) {
      const apiError = err.response?.data as BaseApiResponse;
      error.value = apiError?.message || "Login failed";

      // Reset auth state on error
      token.value = null;
      isAuthenticated.value = false;
      removeToken();

      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function fetchUserProfile() {
    try {
      const response = await authService.getProfile();
      user.value = response.data.data;

      console.log("✅ User profile loaded:", user.value);
    } catch (err: any) {
      console.error("❌ Failed to fetch user profile:", err);
      // If fetching profile fails, logout
      logout();
      throw err; // Re-throw to handle in login
    }
  }

  async function updateProfile(payload: UpdateProfileRequest) {
    loading.value = true;
    error.value = null;

    try {
      const response = await authService.updateProfile(payload);
      user.value = response.data.data;

      return { success: true, data: response.data.data };
    } catch (err: any) {
      const apiError = err.response?.data as BaseApiResponse;
      error.value = apiError?.message || "Failed to update profile";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      user.value = null;
      token.value = null;
      isAuthenticated.value = false;
      removeToken();
    }
  }

  function clearError() {
    error.value = null;
  }

  // Initialize - Check if token exists and fetch profile
  async function initialize() {
    if (token.value && !user.value) {
      try {
        await fetchUserProfile();
      } catch (err) {
        console.error("Failed to initialize user:", err);
        logout();
      }
    }
  }

  return {
    // State
    user,
    token,
    isAuthenticated,
    loading,
    error,
    // Getters
    currentUser,
    isLoggedIn,
    userId,
    username,
    avatarUrl,
    isActive,
    // Actions
    login,
    fetchUserProfile,
    updateProfile,
    logout,
    clearError,
    initialize,
  };
});
