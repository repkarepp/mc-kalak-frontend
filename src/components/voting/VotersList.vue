<script setup lang="ts">
import { computed } from "vue";
import type { ClaimVoteResponse } from "@/types/voting.types";
import { VoteType } from "@/types/voting.types";
import { getAvatarUrl } from "@/services/helpers/formatURL";

interface Props {
  votes: ClaimVoteResponse[];
}

const props = defineProps<Props>();

const approveVotes = computed(() =>
  props.votes.filter((v) => v.type === VoteType.APPROVE),
);

const rejectVotes = computed(() =>
  props.votes.filter((v) => v.type === VoteType.REJECT),
);
</script>

<template>
  <div class="space-y-6">
    <h4 class="text-lg font-semibold text-gray-900">
      Votes ({{ votes.length }})
    </h4>

    <!-- Approve Votes -->
    <div v-if="approveVotes.length > 0" class="space-y-3">
      <div class="flex items-center gap-2">
        <div
          class="flex items-center justify-center w-8 h-8 bg-success-100 rounded-lg"
        >
          <svg
            class="w-5 h-5 text-success-600"
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
        </div>
        <h5 class="text-sm font-semibold text-success-700">
          Approved ({{ approveVotes.length }})
        </h5>
      </div>

      <div class="space-y-2">
        <div
          v-for="vote in approveVotes"
          :key="vote.id"
          class="flex items-center gap-3 p-3 bg-success-50 rounded-lg hover:bg-success-100 transition-colors"
        >
          <img
            :src="getAvatarUrl(vote.voter.avatar_url, vote.voter.username)"
            :alt="vote.voter.username"
            class="w-10 h-10 rounded-full object-cover ring-2 ring-success-200"
          />
          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-900 truncate">
              {{ vote.voter.username }}
            </p>
            <p class="text-xs text-gray-600">
              {{ vote.created_at }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Votes -->
    <div v-if="rejectVotes.length > 0" class="space-y-3">
      <div class="flex items-center gap-2">
        <div
          class="flex items-center justify-center w-8 h-8 bg-danger-100 rounded-lg"
        >
          <svg
            class="w-5 h-5 text-danger-600"
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
        </div>
        <h5 class="text-sm font-semibold text-danger-700">
          Rejected ({{ rejectVotes.length }})
        </h5>
      </div>

      <div class="space-y-2">
        <div
          v-for="vote in rejectVotes"
          :key="vote.id"
          class="flex items-center gap-3 p-3 bg-danger-50 rounded-lg hover:bg-danger-100 transition-colors"
        >
          <img
            :src="getAvatarUrl(vote.voter.avatar_url, vote.voter.username)"
            :alt="vote.voter.username"
            class="w-10 h-10 rounded-full object-cover ring-2 ring-danger-200"
          />
          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-900 truncate">
              {{ vote.voter.username }}
            </p>
            <p class="text-xs text-gray-600">
              {{ vote.created_at }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- No Votes Yet -->
    <div v-if="votes.length === 0" class="text-center py-12">
      <div
        class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4"
      >
        <svg
          class="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <p class="text-gray-600">No votes yet. Be the first to vote!</p>
    </div>
  </div>
</template>
