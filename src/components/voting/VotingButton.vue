<script setup lang="ts">
import { computed } from "vue";
import { useVotingStore } from "@/stores/voting";
import { useAuthStore } from "@/stores/auth";
import { VoteType } from "@/types/voting.types";

interface Props {
  claimId: string;
  disabled?: boolean;
}

interface Emits {
  (e: "vote", voteType: VoteType): void;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<Emits>();

const votingStore = useVotingStore();
const authStore = useAuthStore();

const hasVoted = computed(() => {
  const userId = authStore.userId;
  return userId ? votingStore.hasUserVoted(props.claimId, userId) : false;
});

const handleVote = (voteType: VoteType) => {
  emit("vote", voteType);
};
</script>

<template>
  <div class="flex gap-3">
    <button
      class="flex-1 btn btn-success text-base gap-2 py-3"
      :disabled="disabled || hasVoted"
      @click="handleVote(VoteType.APPROVE)"
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
          d="M5 13l4 4L19 7"
        />
      </svg>
      <span>Approve</span>
    </button>

    <button
      class="flex-1 btn btn-danger text-base gap-2 py-3"
      :disabled="disabled || hasVoted"
      @click="handleVote(VoteType.REJECT)"
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
      <span>Reject</span>
    </button>
  </div>
</template>
