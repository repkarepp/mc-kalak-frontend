import type { AxiosResponse } from "axios";
import apiClient from "./axiosInstance";
import type {
  ClaimVoteRequest,
  SubmitVoteResponse,
  VotesListResponse,
} from "@/types/voting.types";
import type { BaseApiResponse } from "@/types/common.types";

export default {
  // Get all votes for a claim
  getVotesByClaimId(
    claimId: string,
  ): Promise<AxiosResponse<BaseApiResponse<VotesListResponse>>> {
    return apiClient.get<BaseApiResponse<VotesListResponse>>(
      `/claims/${claimId}/votes`,
    );
  },

  // Submit a vote (POST /claims/:id/vote)
  submitVote(
    claimId: string,
    payload: ClaimVoteRequest,
  ): Promise<AxiosResponse<BaseApiResponse<SubmitVoteResponse>>> {
    return apiClient.post<BaseApiResponse<SubmitVoteResponse>>(
      `/claims/${claimId}/vote`,
      payload,
    );
  },
};
