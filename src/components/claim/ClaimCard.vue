<script setup lang="ts">
import { computed } from "vue";
import type { ClaimResponse } from "@/types/claim.types";
import ClaimStatusBadge from "./ClaimStatusBadge.vue";
import { CLAIM_EVENT_LABELS } from "@/utils/constants";
import { getAvatarUrl, getImageUrl } from "@/services/helpers/formatURL";

interface Props {
  claim: ClaimResponse;
}

const props = defineProps<Props>();

const eventLabel = computed(
  () => CLAIM_EVENT_LABELS[props.claim.event] || props.claim.event,
);

const totalVotes = computed(
  () => props.claim.approve_count + props.claim.reject_count,
);

const approvalRate = computed(() => {
  if (totalVotes.value === 0) return 0;
  return Math.round((props.claim.approve_count / totalVotes.value) * 100);
});
</script>

<template>
  <div class="card card-hover cursor-pointer group">
    <!-- Screenshot -->
    <div
      class="relative aspect-video mb-4 rounded-lg overflow-hidden bg-gray-100"
    >
      <img
        :src="getImageUrl(claim.screenshot_url)"
        :alt="`${claim.event} match screenshot`"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div class="absolute top-3 right-3">
        <ClaimStatusBadge :status="claim.status" />
      </div>
    </div>

    <!-- Content -->
    <div class="space-y-3">
      <!-- Event & Date -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="badge badge-primary uppercase">{{ eventLabel }}</span>
          <span class="text-sm text-gray-500">•</span>
          <span class="text-sm text-gray-600"
            >{{ totalVotes }}/{{ claim.total_player }} voted</span
          >
        </div>
      </div>

      <!-- Players -->
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 flex-1 min-w-0">
          <img
            :src="
              getAvatarUrl(
                claim.claimed_player.avatar_url,
                claim.claimed_player.username,
              )
            "
            :alt="claim.claimed_player.username"
            class="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ claim.claimed_player.username }}
            </p>
            <p class="text-xs text-gray-500">Claimed Player</p>
          </div>
        </div>

        <svg
          class="w-5 h-5 text-gray-400 flex-shrink-0"
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

        <div class="flex items-center gap-2 flex-1 min-w-0">
          <img
            :src="
              getAvatarUrl(claim.reporter.avatar_url, claim.reporter.username)
            "
            :alt="claim.reporter.username"
            class="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ claim.reporter.username }}
            </p>
            <p class="text-xs text-gray-500">Reporter</p>
          </div>
        </div>
      </div>

      <!-- Vote Progress -->
      <div v-if="totalVotes > 0" class="space-y-1.5">
        <div class="flex justify-between text-xs text-gray-600">
          <span>{{ claim.approve_count }} Approve</span>
          <span>{{ claim.reject_count }} Reject</span>
        </div>
        <div class="flex gap-1 h-1.5">
          <div
            class="bg-success-500 rounded-full transition-all duration-300"
            :style="{ width: `${approvalRate}%` }"
          />
          <div
            class="bg-danger-500 rounded-full transition-all duration-300"
            :style="{ width: `${100 - approvalRate}%` }"
          />
        </div>
      </div>

      <!-- Footer -->
      <div
        class="flex items-center justify-between pt-2 border-t border-gray-100"
      >
        <span class="text-xs text-gray-500">
          {{ claim.created_at }}
        </span>
        <button
          class="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
        >
          View Details →
        </button>
      </div>
    </div>
  </div>
</template>
