<script setup lang="ts">
import { onMounted } from "vue";
import { useUIStore } from "@/stores/ui";
import { useAuthStore } from "@/stores/auth";

const uiStore = useUIStore();
const authStore = useAuthStore();

onMounted(async () => {
  uiStore.initTheme();

  // Initialize auth - fetch user if token exists
  await authStore.initialize();
});
</script>

<template>
  <div id="app" class="min-h-screen">
    <RouterView />
  </div>
</template>
