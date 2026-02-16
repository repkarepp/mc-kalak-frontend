import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  ClaimVoteResponse,
  VoteType,
  VoteStats,
  ClaimVoteRequest,
  SubmitVoteResponse,
} from "@/types/voting.types";
import type { BaseApiResponse } from "@/types/common.types";
import votingService from "@/services/api/votingService";
import { useClaimStore } from "./claim";
import { VoteType as VoteTypeEnum } from "@/types/voting.types";

export const useVotingStore = defineStore("voting", () => {
  // State
  const votes = ref<Record<string, ClaimVoteResponse[]>>({});
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const votingInProgress = ref<boolean>(false);

  // Getters
  const getVotesByClaim = computed(
    () =>
      (claimId: string): ClaimVoteResponse[] => {
        return votes.value[claimId] || [];
      },
  );

  const hasUserVoted = computed(
    () =>
      (claimId: string, userId: string): boolean => {
        const claimVotes = votes.value[claimId] || [];
        return claimVotes.some((vote) => vote.voter.id === userId);
      },
  );

  const getUserVote = computed(
    () =>
      (claimId: string, userId: string): ClaimVoteResponse | undefined => {
        const claimVotes = votes.value[claimId] || [];
        return claimVotes.find((vote) => vote.voter.id === userId);
      },
  );

  const getVoteStats = computed(
    () =>
      (claimId: string, totalParticipants?: number): VoteStats => {
        const claimVotes = votes.value[claimId] || [];
        const approve = claimVotes.filter(
          (v) => v.type === VoteTypeEnum.APPROVE,
        ).length;
        const reject = claimVotes.filter(
          (v) => v.type === VoteTypeEnum.REJECT,
        ).length;
        const total = claimVotes.length;
        const participants = totalParticipants || total;

        return {
          approve,
          reject,
          total,
          totalParticipants: participants,
          approvalPercentage:
            participants > 0 ? Math.round((approve / participants) * 100) : 0,
          rejectionPercentage:
            participants > 0 ? Math.round((reject / participants) * 100) : 0,
        };
      },
  );

  const getApprovalPercentage = computed(() => (claimId: string): number => {
    const claimVotes = votes.value[claimId] || [];
    if (claimVotes.length === 0) return 0;

    const approve = claimVotes.filter(
      (v) => v.type === VoteTypeEnum.APPROVE,
    ).length;
    return Math.round((approve / claimVotes.length) * 100);
  });

  const getRejectionPercentage = computed(() => (claimId: string): number => {
    const claimVotes = votes.value[claimId] || [];
    if (claimVotes.length === 0) return 0;

    const reject = claimVotes.filter(
      (v) => v.type === VoteTypeEnum.REJECT,
    ).length;
    return Math.round((reject / claimVotes.length) * 100);
  });

  const getVotesByType = computed(
    () =>
      (claimId: string, voteType: VoteType): ClaimVoteResponse[] => {
        const claimVotes = votes.value[claimId] || [];
        return claimVotes.filter((v) => v.type === voteType);
      },
  );

  // Actions
  async function fetchVotes(claimId: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await votingService.getVotesByClaimId(claimId);

      // Handle response structure
      const votesData = response.data.data?.votes || [];
      votes.value[claimId] = votesData;

      return { success: true, data: votesData };
    } catch (err: any) {
      const apiError = err.response?.data as BaseApiResponse;
      error.value = apiError?.message || "Failed to fetch votes";

      // Set empty array on error
      votes.value[claimId] = [];

      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function submitVote(claimId: string, voteType: VoteType) {
    votingInProgress.value = true;
    error.value = null;

    try {
      const payload: ClaimVoteRequest = {
        type: voteType,
      };

      const response = await votingService.submitVote(claimId, payload);
      const data: SubmitVoteResponse = response.data.data;

      // Update votes - add new vote to array
      if (!votes.value[claimId]) {
        votes.value[claimId] = [];
      }
      votes.value[claimId].push(data.vote);

      // Update claim status and vote counts
      const claimStore = useClaimStore();

      if (data.claim_status) {
        claimStore.updateClaimStatus(claimId, data.claim_status);
      }

      if (data.approve_count !== undefined && data.reject_count !== undefined) {
        claimStore.updateClaimVoteCount(
          claimId,
          data.approve_count,
          data.reject_count,
        );
      }

      return { success: true, data };
    } catch (err: any) {
      const apiError = err.response?.data as BaseApiResponse;
      error.value = apiError?.message || "Failed to submit vote";
      return { success: false, error: error.value };
    } finally {
      votingInProgress.value = false;
    }
  }

  // Helper functions
  function hasMajority(
    claimId: string,
    totalParticipants: number,
  ): {
    reached: boolean;
    type: "approve" | "reject" | null;
  } {
    const stats = getVoteStats.value(claimId, totalParticipants);
    const majorityThreshold = Math.ceil(totalParticipants / 2);

    if (stats.approve >= majorityThreshold) {
      return { reached: true, type: "approve" };
    }

    if (stats.reject >= majorityThreshold) {
      return { reached: true, type: "reject" };
    }

    return { reached: false, type: null };
  }

  function canUserVote(claimId: string, userId: string): boolean {
    return !hasUserVoted.value(claimId, userId);
  }

  function getVotingProgress(
    claimId: string,
    totalParticipants: number,
  ): number {
    const stats = getVoteStats.value(claimId, totalParticipants);
    if (totalParticipants === 0) return 0;
    return Math.round((stats.total / totalParticipants) * 100);
  }

  function clearVotesForClaim(claimId: string) {
    delete votes.value[claimId];
  }

  function clearError() {
    error.value = null;
  }

  function resetState() {
    votes.value = {};
    loading.value = false;
    error.value = null;
    votingInProgress.value = false;
  }

  return {
    // State
    votes,
    loading,
    error,
    votingInProgress,
    // Getters
    getVotesByClaim,
    hasUserVoted,
    getUserVote,
    getVoteStats,
    getApprovalPercentage,
    getRejectionPercentage,
    getVotesByType,
    // Actions
    fetchVotes,
    submitVote,
    // Helpers
    hasMajority,
    canUserVote,
    getVotingProgress,
    clearVotesForClaim,
    clearError,
    resetState,
  };
});
