<script setup lang="ts">
import { computed } from "vue";
import { ClaimStatus } from "@/types/claim.types";

interface Props {
  status: ClaimStatus;
}

const props = defineProps<Props>();

interface StatusConfig {
  text: string;
  class: string;
}

const statusConfig: Record<ClaimStatus, StatusConfig> = {
  [ClaimStatus.PENDING]: {
    text: "Pending",
    class: "badge-warning",
  },
  [ClaimStatus.FINAL_APPROVED]: {
    text: "Approved",
    class: "badge-success",
  },
  [ClaimStatus.FINAL_REJECTED]: {
    text: "Rejected",
    class: "badge-danger",
  },
};

const statusText = computed(
  () => statusConfig[props.status]?.text || "Unknown",
);
const statusClass = computed(
  () => statusConfig[props.status]?.class || "badge-primary",
);
</script>

<template>
  <span :class="['badge uppercase tracking-wide', statusClass]">
    {{ statusText }}
  </span>
</template>
