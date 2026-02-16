import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  ClaimResponse,
  ClaimStatus,
  ClaimEvent,
  CreateClaimRequest,
  UpdateClaimRequest,
  ClaimFilters,
} from "@/types/claim.types";
import type { BaseApiResponse } from "@/types/common.types";
import claimService from "@/services/api/claimService";
import { ClaimStatus as ClaimStatusEnum } from "@/types/claim.types";

export const useClaimStore = defineStore("claim", () => {
  // State
  const claims = ref<ClaimResponse[]>([]);
  const currentClaim = ref<ClaimResponse | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    page: 1,
    per_page: 10,
    max_page: 0,
    count: 0,
  });
  const filters = ref<ClaimFilters>({});

  // Getters
  const pendingClaims = computed(() =>
    claims.value.filter((claim) => claim.status === ClaimStatusEnum.PENDING),
  );

  const approvedClaims = computed(() =>
    claims.value.filter(
      (claim) => claim.status === ClaimStatusEnum.FINAL_APPROVED,
    ),
  );

  const rejectedClaims = computed(() =>
    claims.value.filter(
      (claim) => claim.status === ClaimStatusEnum.FINAL_REJECTED,
    ),
  );

  const userClaims = computed(
    () => (userId: string) =>
      claims.value.filter((claim) => claim.claimed_player.id === userId),
  );

  const claimsByEvent = computed(
    () => (event: ClaimEvent) =>
      claims.value.filter((claim) => claim.event === event),
  );

  const hasMorePages = computed(
    () => pagination.value.page < pagination.value.max_page,
  );

  // Actions
  async function fetchClaims(
    params?: Partial<ClaimFilters & { page?: number; per_page?: number }>,
  ) {
    loading.value = true;
    error.value = null;

    try {
      const response = await claimService.getClaims({
        page: pagination.value.page,
        per_page: pagination.value.per_page,
        ...filters.value,
        ...params,
      });

      const data = response.data.data;
      claims.value = Array.isArray(data) ? data : [];

      if (response.data.meta) {
        pagination.value = response.data.meta;
      }

      return { success: true };
    } catch (err: any) {
      const apiError = err.response?.data as BaseApiResponse;
      error.value = apiError?.message || "Failed to fetch claims";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function fetchClaimById(claimId: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await claimService.getClaimById(claimId);
      currentClaim.value = response.data.data;

      return { success: true, data: response.data.data };
    } catch (err: any) {
      const apiError = err.response?.data as BaseApiResponse;
      error.value = apiError?.message || "Failed to fetch claim";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function createClaim(claimData: CreateClaimRequest) {
    loading.value = true;
    error.value = null;

    try {
      const response = await claimService.createClaim(claimData);
      const newClaim: ClaimResponse = response.data.data;
      claims.value.unshift(newClaim);

      return { success: true, data: newClaim };
    } catch (err: any) {
      const apiError = err.response?.data as BaseApiResponse;
      error.value = apiError?.message || "Failed to create claim";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function updateClaim(claimId: string, claimData: UpdateClaimRequest) {
    loading.value = true;
    error.value = null;

    try {
      const response = await claimService.updateClaim(claimId, claimData);
      const updatedClaim: ClaimResponse = response.data.data;

      // Update in claims array
      const index = claims.value.findIndex((c) => c.id === claimId);
      if (index !== -1) {
        claims.value[index] = updatedClaim;
      }

      // Update current claim
      if (currentClaim.value?.id === claimId) {
        currentClaim.value = updatedClaim;
      }

      return { success: true, data: updatedClaim };
    } catch (err: any) {
      const apiError = err.response?.data as BaseApiResponse;
      error.value = apiError?.message || "Failed to update claim";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function deleteClaim(claimId: string) {
    loading.value = true;
    error.value = null;

    try {
      await claimService.deleteClaim(claimId);

      // Remove from claims array
      claims.value = claims.value.filter((c) => c.id !== claimId);

      // Clear current claim if it's the deleted one
      if (currentClaim.value?.id === claimId) {
        currentClaim.value = null;
      }

      return { success: true };
    } catch (err: any) {
      const apiError = err.response?.data as BaseApiResponse;
      error.value = apiError?.message || "Failed to delete claim";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  }

  function updateClaimStatus(claimId: string, newStatus: ClaimStatus) {
    const claim = claims.value.find((c) => c.id === claimId);
    if (claim) {
      claim.status = newStatus;
    }

    if (currentClaim.value?.id === claimId) {
      currentClaim.value.status = newStatus;
    }
  }

  function updateClaimVoteCount(
    claimId: string,
    approveCount: number,
    rejectCount: number,
  ) {
    const claim = claims.value.find((c) => c.id === claimId);
    if (claim) {
      claim.approve_count = approveCount;
      claim.reject_count = rejectCount;
    }

    if (currentClaim.value?.id === claimId) {
      currentClaim.value.approve_count = approveCount;
      currentClaim.value.reject_count = rejectCount;
    }
  }

  function setFilters(newFilters: Partial<ClaimFilters>) {
    filters.value = { ...filters.value, ...newFilters };
    pagination.value.page = 1;
  }

  function setPage(page: number) {
    pagination.value.page = page;
  }

  function clearCurrentClaim() {
    currentClaim.value = null;
  }

  function clearError() {
    error.value = null;
  }

  function resetState() {
    claims.value = [];
    currentClaim.value = null;
    loading.value = false;
    error.value = null;
    pagination.value = {
      page: 1,
      per_page: 10,
      max_page: 0,
      count: 0,
    };
    filters.value = {};
  }

  return {
    // State
    claims,
    currentClaim,
    loading,
    error,
    pagination,
    filters,
    // Getters
    pendingClaims,
    approvedClaims,
    rejectedClaims,
    userClaims,
    claimsByEvent,
    hasMorePages,
    // Actions
    fetchClaims,
    fetchClaimById,
    createClaim,
    updateClaim,
    deleteClaim,
    updateClaimStatus,
    updateClaimVoteCount,
    setFilters,
    setPage,
    clearCurrentClaim,
    clearError,
    resetState,
  };
});
