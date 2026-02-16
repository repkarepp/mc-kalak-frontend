<script setup lang="ts">
import { computed } from "vue";
import type { VoteStats } from "@/types/voting.types";

interface Props {
  stats: VoteStats;
  totalParticipants?: number;
}

const props = withDefaults(defineProps<Props>(), {
  totalParticipants: 0,
});

const approvePercentage = computed(() => {
  if (props.stats.total === 0) return 0;
  return Math.round((props.stats.approve / props.stats.total) * 100);
});

const rejectPercentage = computed(() => {
  if (props.stats.total === 0) return 0;
  return Math.round((props.stats.reject / props.stats.total) * 100);
});

const participationRate = computed(() => {
  if (props.totalParticipants === 0) return 0;
  return Math.round((props.stats.total / props.totalParticipants) * 100);
});
</script>

<template>
  <div class="bg-gray-50 rounded-xl p-5 space-y-4">
    <div class="flex justify-between items-center">
      <h4 class="text-base font-semibold text-gray-900">Voting Progress</h4>
      <span class="text-sm text-gray-600 font-medium">
        {{ stats.total }} / {{ totalParticipants }} voted
      </span>
    </div>

    <div class="space-y-4">
      <!-- Approve Progress -->
      <div class="space-y-2">
        <div class="flex justify-between text-sm">
          <span class="font-medium text-gray-700">Approve</span>
          <span class="font-semibold text-success-600">
            {{ stats.approve }} ({{ approvePercentage }}%)
          </span>
        </div>
        <div class="h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-success-500 transition-all duration-500 ease-out rounded-full"
            :style="{ width: `${approvePercentage}%` }"
          />
        </div>
      </div>

      <!-- Reject Progress -->
      <div class="space-y-2">
        <div class="flex justify-between text-sm">
          <span class="font-medium text-gray-700">Reject</span>
          <span class="font-semibold text-danger-600">
            {{ stats.reject }} ({{ rejectPercentage }}%)
          </span>
        </div>
        <div class="h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-danger-500 transition-all duration-500 ease-out rounded-full"
            :style="{ width: `${rejectPercentage}%` }"
          />
        </div>
      </div>
    </div>

    <div v-if="totalParticipants > 0" class="pt-2 border-t border-gray-200">
      <div class="text-center text-sm text-gray-600">
        Participation Rate:
        <span class="font-semibold text-primary-600"
          >{{ participationRate }}%</span
        >
      </div>
    </div>
  </div>
</template>
