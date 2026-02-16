<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const goHome = () => {
  router.push({ name: "Dashboard" });
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-gray-300 mb-4">404</h1>
      <h2 class="text-3xl font-semibold text-gray-900 mb-2">Page Not Found</h2>
      <p class="text-gray-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button @click="goHome" class="btn btn-primary">Go to Dashboard</button>
    </div>
  </div>
</template>
