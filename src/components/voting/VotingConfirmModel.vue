<script setup lang="ts">
import { computed } from "vue";
import { VoteType } from "@/types/voting.types";

interface Props {
  isOpen: boolean;
  voteType: VoteType;
  loading?: boolean;
}

interface Emits {
  (e: "close"): void;
  (e: "confirm"): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<Emits>();

const voteConfig = computed(() => {
  return props.voteType === VoteType.APPROVE
    ? {
        color: "text-success-600",
        bgColor: "bg-success-50",
        buttonClass: "btn-success",
      }
    : {
        color: "text-danger-600",
        bgColor: "bg-danger-50",
        buttonClass: "btn-danger",
      };
});

const handleClose = () => {
  if (!props.loading) {
    emit("close");
  }
};

const handleConfirm = () => {
  emit("confirm");
};
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        @click="handleClose"
      >
        <Transition
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="isOpen"
            class="bg-white rounded-2xl shadow-elevated max-w-md w-full"
            @click.stop
          >
            <!-- Header -->
            <div
              class="flex items-center justify-between p-6 border-b border-gray-200"
            >
              <h3 class="text-xl font-semibold text-gray-900">
                Confirm Your Vote
              </h3>
              <button
                class="text-gray-400 hover:text-gray-600 transition-colors"
                @click="handleClose"
              >
                <svg
                  class="w-6 h-6"
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

            <!-- Body -->
            <div class="p-6 space-y-4">
              <div :class="['p-4 rounded-lg', voteConfig.bgColor]">
                <p class="text-gray-700">
                  Are you sure you want to
                  <strong :class="voteConfig.color">{{ voteType }}</strong>
                  this claim?
                </p>
              </div>

              <div class="flex items-start gap-2 text-sm text-danger-600">
                <svg
                  class="w-5 h-5 flex-shrink-0 mt-0.5"
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
                <span>This action cannot be undone.</span>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex gap-3 p-6 border-t border-gray-200">
              <button
                class="flex-1 btn btn-secondary"
                @click="handleClose"
                :disabled="loading"
              >
                Cancel
              </button>
              <button
                :class="['flex-1 btn', voteConfig.buttonClass]"
                @click="handleConfirm"
                :disabled="loading"
              >
                <svg
                  v-if="loading"
                  class="animate-spin -ml-1 mr-2 h-4 w-4"
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
                <span>{{ loading ? "Submitting..." : "Confirm" }}</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
