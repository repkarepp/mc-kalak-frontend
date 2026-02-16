import type { AxiosResponse } from "axios";
import apiClient from "./axiosInstance";
import type {
  ClaimResponse,
  CreateClaimRequest,
  UpdateClaimRequest,
  ClaimFilters,
} from "@/types/claim.types";
import type { BaseApiResponse, PaginationParams } from "@/types/common.types";

interface GetClaimsParams
  extends Partial<PaginationParams>, Partial<ClaimFilters> {}

export default {
  getClaims(
    params: GetClaimsParams,
  ): Promise<AxiosResponse<BaseApiResponse<ClaimResponse[]>>> {
    return apiClient.get<BaseApiResponse<ClaimResponse[]>>("/claims", {
      params,
    });
  },

  getClaimById(
    claimId: string,
  ): Promise<AxiosResponse<BaseApiResponse<ClaimResponse>>> {
    return apiClient.get<BaseApiResponse<ClaimResponse>>(`/claims/${claimId}`);
  },

  createClaim(
    claimData: CreateClaimRequest,
  ): Promise<AxiosResponse<BaseApiResponse<ClaimResponse>>> {
    return apiClient.post<BaseApiResponse<ClaimResponse>>("/claims", claimData);
  },

  updateClaim(
    claimId: string,
    data: UpdateClaimRequest,
  ): Promise<AxiosResponse<BaseApiResponse<ClaimResponse>>> {
    return apiClient.put<BaseApiResponse<ClaimResponse>>(
      `/claims/${claimId}`,
      data,
    );
  },

  deleteClaim(claimId: string): Promise<AxiosResponse<BaseApiResponse<void>>> {
    return apiClient.delete<BaseApiResponse<void>>(`/claims/${claimId}`);
  },
};
