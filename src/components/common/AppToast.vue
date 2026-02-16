<script setup lang="ts">
import { ref, watch } from "vue";

interface Props {
  show: boolean;
  type?: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
}

interface Emits {
  (e: "close"): void;
}

const props = withDefaults(defineProps<Props>(), {
  type: "info",
  duration: 3000,
});

const emit = defineEmits<Emits>();

const isVisible = ref(false);

watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      isVisible.value = true;
      if (props.duration > 0) {
        setTimeout(() => {
          close();
        }, props.duration);
      }
    }
  },
);

const close = () => {
  isVisible.value = false;
  setTimeout(() => {
    emit("close");
  }, 300);
};

const typeConfig = {
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    icon: "text-green-500",
    text: "text-green-800",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "text-red-500",
    text: "text-red-800",
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    icon: "text-yellow-500",
    text: "text-yellow-800",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "text-blue-500",
    text: "text-blue-800",
  },
};
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-[-100%]"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-[-100%]"
    >
      <div
        v-if="isVisible"
        class="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
      >
        <div
          :class="[
            'rounded-xl border-2 shadow-lg p-4',
            typeConfig[type].bg,
            typeConfig[type].border,
          ]"
        >
          <div class="flex items-start gap-3">
            <!-- Icon -->
            <div class="flex-shrink-0 mt-0.5">
              <!-- Success Icon -->
              <svg
                v-if="type === 'success'"
                :class="['w-6 h-6', typeConfig[type].icon]"
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

              <!-- Error Icon -->
              <svg
                v-else-if="type === 'error'"
                :class="['w-6 h-6', typeConfig[type].icon]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <!-- Warning Icon -->
              <svg
                v-else-if="type === 'warning'"
                :class="['w-6 h-6', typeConfig[type].icon]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>

              <!-- Info Icon -->
              <svg
                v-else
                :class="['w-6 h-6', typeConfig[type].icon]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <p :class="['font-bold text-base', typeConfig[type].text]">
                {{ title }}
              </p>
              <p
                v-if="message"
                :class="['text-sm mt-1', typeConfig[type].text]"
              >
                {{ message }}
              </p>
            </div>

            <!-- Close Button -->
            <button
              @click="close"
              :class="[
                'flex-shrink-0 hover:opacity-70 transition-opacity',
                typeConfig[type].icon,
              ]"
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
      </div>
    </Transition>
  </Teleport>
</template>
