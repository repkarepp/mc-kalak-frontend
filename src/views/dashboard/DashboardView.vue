<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import AppToast from "@/components/common/AppToast.vue";

const authStore = useAuthStore();
const router = useRouter();

const showWelcomeToast = ref(false);
const isLoading = ref(true);

// Safe username getter
const displayUsername = computed(() => {
  return authStore.username || "Player";
});

onMounted(async () => {
  // Ensure user data is loaded
  if (!authStore.user) {
    try {
      await authStore.fetchUserProfile();
    } catch (err) {
      console.error("Failed to load user:", err);
      // Redirect to login if profile fetch fails
      router.push({ name: "Login" });
      return;
    }
  }

  isLoading.value = false;

  // Show welcome toast after user is loaded
  setTimeout(() => {
    showWelcomeToast.value = true;
  }, 300);
});

const handleLogout = async () => {
  await authStore.logout();
  router.push({ name: "Login" });
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
    <!-- Loading State -->
    <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <svg
          class="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
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
        <p class="text-gray-600 font-medium">Loading...</p>
      </div>
    </div>

    <!-- Dashboard Content -->
    <template v-else>
      <!-- Welcome Toast -->
      <AppToast
        :show="showWelcomeToast"
        type="success"
        title="🎉 Selamat datang di Kalak!"
        :message="`Halo ${displayUsername}, siap claim match hari ini?`"
        :duration="4000"
        @close="showWelcomeToast = false"
      />

      <!-- Header -->
      <header
        class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <!-- Logo & Title -->
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md"
              >
                <svg
                  class="w-6 h-6 text-white"
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
              <div>
                <h1 class="text-gray-900 font-bold text-lg">
                  Magic Chess Gogo
                </h1>
                <p class="text-blue-600 text-xs font-semibold">
                  Kalak Dashboard
                </p>
              </div>
            </div>

            <!-- User Menu -->
            <div class="flex items-center gap-4">
              <div class="text-right hidden sm:block">
                <p class="text-gray-900 font-semibold">{{ displayUsername }}</p>
                <p class="text-gray-500 text-xs">Member Kalak</p>
              </div>
              <button
                @click="handleLogout"
                class="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-red-600 hover:text-red-700 font-medium transition-all text-sm"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Welcome Section -->
        <div class="text-center mb-12">
          <div
            class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-xl mb-6"
          >
            <svg
              class="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>

          <h2 class="text-4xl font-bold text-gray-900 mb-3">
            Halo, {{ displayUsername }}! 👋
          </h2>
          <p class="text-xl text-gray-600 mb-6">
            Selamat datang di dashboard Kalak
          </p>

          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <!-- Total Claims -->
            <div
              class="bg-white rounded-2xl p-6 border-2 border-blue-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                class="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3 mx-auto"
              >
                <svg
                  class="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p class="text-3xl font-bold text-gray-900 mb-1">0</p>
              <p class="text-sm text-gray-600">Total Claims</p>
            </div>

            <!-- Pending Votes -->
            <div
              class="bg-white rounded-2xl p-6 border-2 border-yellow-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                class="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-3 mx-auto"
              >
                <svg
                  class="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p class="text-3xl font-bold text-gray-900 mb-1">0</p>
              <p class="text-sm text-gray-600">Pending Votes</p>
            </div>

            <!-- Total Matches -->
            <div
              class="bg-white rounded-2xl p-6 border-2 border-green-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                class="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-3 mx-auto"
              >
                <svg
                  class="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p class="text-3xl font-bold text-gray-900 mb-1">0</p>
              <p class="text-sm text-gray-600">Match Played</p>
            </div>
          </div>
        </div>

        <!-- Coming Soon Card -->
        <div class="max-w-2xl mx-auto">
          <div
            class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-center shadow-xl"
          >
            <div
              class="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4"
            >
              <svg
                class="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-white mb-2">
              Dashboard Masih Dibangun
            </h3>
            <p class="text-blue-100 mb-6">
              Fitur claim, vote, dan statistik player akan segera hadir! 🚀
            </p>
            <div
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 rounded-full text-white text-sm font-medium"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>Coming Soon</span>
            </div>
          </div>
        </div>
      </main>
    </template>
  </div>
</template>
