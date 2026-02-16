<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import type { LoginRequest } from "@/types/auth.types";
import AppToast from "@/components/common/AppToast.vue";

const router = useRouter();
const authStore = useAuthStore();

const credentials = reactive<LoginRequest>({
  username: "",
  password: "",
});

const errorMessage = ref<string>("");
const showPassword = ref(false);

// Toast state
const showToast = ref(false);
const toastConfig = ref({
  type: "success" as "success" | "error",
  title: "",
  message: "",
});

const handleLogin = async () => {
  errorMessage.value = "";

  const result = await authStore.login(credentials);

  if (result.success) {
    // Username sudah ter-load dari fetchUserProfile
    console.log("Login success, username:", authStore.username);

    // Show success toast
    toastConfig.value = {
      type: "success",
      title: "🎉 Welcome to Kalak!",
      message: `Siap adu jago, ${authStore.username}?`,
    };
    showToast.value = true;

    // Redirect after toast shows
    setTimeout(() => {
      router.push({ name: "Dashboard" });
    }, 1500);
  } else {
    errorMessage.value = result.error || "Login gagal";
  }
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
    <!-- Toast Notification -->
    <AppToast
      :show="showToast"
      :type="toastConfig.type"
      :title="toastConfig.title"
      :message="toastConfig.message"
      :duration="3000"
      @close="showToast = false"
    />

    <!-- Decorative Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Top Right Circle -->
      <div
        class="absolute -top-32 -right-32 w-96 h-96 bg-blue-100 rounded-full opacity-40 blur-3xl"
      ></div>
      <!-- Bottom Left Circle -->
      <div
        class="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-200 rounded-full opacity-30 blur-3xl"
      ></div>
      <!-- Chess Pattern -->
      <div class="absolute top-20 right-20 w-24 h-24 opacity-5">
        <svg viewBox="0 0 100 100" class="w-full h-full text-blue-600">
          <path
            fill="currentColor"
            d="M50,10 L70,30 L70,70 L50,90 L30,70 L30,30 Z"
          />
        </svg>
      </div>
      <div class="absolute bottom-40 left-20 w-32 h-32 opacity-5">
        <svg viewBox="0 0 100 100" class="w-full h-full text-blue-600">
          <circle cx="50" cy="50" r="40" fill="currentColor" />
        </svg>
      </div>
    </div>

    <!-- Content -->
    <div
      class="relative z-10 min-h-screen flex items-center justify-center px-4 py-12"
    >
      <div class="w-full max-w-md">
        <!-- Header -->
        <div class="text-center mb-10">
          <!-- Logo -->
          <div
            class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-lg mb-6 transform hover:scale-105 transition-transform"
          >
            <svg
              class="w-11 h-11 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
          </div>

          <!-- Title -->
          <h1 class="text-4xl font-black text-gray-900 mb-2">
            Magic Chess Gogo
          </h1>
          <div
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full"
          >
            <span class="text-2xl">🎮</span>
            <span class="text-lg font-bold text-blue-600">Kalak Edition</span>
          </div>
          <p class="text-gray-600 mt-4 text-lg">Siapa 👑 hari ini?</p>
        </div>

        <!-- Login Card -->
        <div class="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Error Message -->
            <div
              v-if="errorMessage"
              class="p-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <div class="flex items-start gap-3">
                <svg
                  class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div class="flex-1">
                  <p class="text-sm font-medium text-red-800">
                    {{ errorMessage }}
                  </p>
                </div>
                <button
                  type="button"
                  @click="errorMessage = ''"
                  class="text-red-400 hover:text-red-600 transition-colors"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Username -->
            <div class="space-y-2">
              <label
                for="username"
                class="block text-sm font-semibold text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                v-model="credentials.username"
                type="text"
                required
                autocomplete="username"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900 placeholder-gray-400"
                placeholder="Masukkan username"
                :disabled="authStore.loading"
              />
            </div>

            <!-- Password -->
            <div class="space-y-2">
              <label
                for="password"
                class="block text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="credentials.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  autocomplete="current-password"
                  class="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900 placeholder-gray-400"
                  placeholder="Masukkan password"
                  :disabled="authStore.loading"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    v-if="!showPassword"
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <svg
                    v-else
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              :disabled="authStore.loading"
            >
              <span
                v-if="!authStore.loading"
                class="flex items-center justify-center gap-2"
              >
                <span class="text-lg">Masuk Sekarang</span>
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
              <span v-else class="flex items-center justify-center gap-3">
                <svg
                  class="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Loading...</span>
              </span>
            </button>
          </form>
        </div>

        <!-- Footer Info -->
        <div class="mt-8 text-center space-y-3">
          <div
            class="flex items-center justify-center gap-2 text-gray-500 text-sm"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
            <span>Claim hasil match & validasi bareng Kalak</span>
          </div>

          <p class="text-gray-400 text-xs">
            © 2026 Magic Chess Gogo - Kalak Edition
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
