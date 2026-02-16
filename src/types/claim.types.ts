import type { TimestampTemplate } from "./common.types";
import type { UserSimpleResponse } from "./auth.types";

// Claim Event Enum (sesuai dengan backend: KING, KONG, NGOK)
export const ClaimEvent = {
  KING: "KING",
  KONG: "KONG",
  NGOK: "NGOK",
} as const;
export type ClaimEvent = (typeof ClaimEvent)[keyof typeof ClaimEvent];

// Claim Status Enum
export const ClaimStatus = {
  PENDING: "PENDING",
  FINAL_APPROVED: "FINAL_APPROVED",
  FINAL_REJECTED: "FINAL_REJECTED",
} as const;
export type ClaimStatus = (typeof ClaimStatus)[keyof typeof ClaimStatus];

// Create Claim Request
export interface CreateClaimRequest {
  event: ClaimEvent;
  match_date: string;
  total_player: number; // min 2, max 8
  screenshot_url: string;
  claimed_player_id: string; // UUID as string
  reporter_id: string; // UUID as string
}

// Claim Response
export interface ClaimResponse extends TimestampTemplate {
  id: string; // UUID as string
  event: ClaimEvent;
  status: ClaimStatus;
  match_date: string;
  total_player: number;
  screenshot_url: string;
  approve_count: number;
  reject_count: number;
  claimed_player: UserSimpleResponse;
  reporter: UserSimpleResponse;
}

// Update Claim Request
export interface UpdateClaimRequest {
  event: ClaimEvent;
  match_date: string;
  total_player: number;
  screenshot_url: string;
  claimed_player_id: string;
  reporter_id: string;
}

// Claim Filters untuk query
export interface ClaimFilters {
  status?: ClaimStatus;
  event?: ClaimEvent;
  claimed_player_id?: string;
  reporter_id?: string;
  date_from?: string;
  date_to?: string;
}

// Claim Pagination Response
export interface ClaimPaginationResponse {
  data: ClaimResponse[];
  page: number;
  per_page: number;
  max_page: number;
  count: number;
}

// Claim State
export interface ClaimState {
  claims: ClaimResponse[];
  currentClaim: ClaimResponse | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    per_page: number;
    max_page: number;
    count: number;
  };
  filters: ClaimFilters;
}

// Alias untuk backward compatibility
export type Claim = ClaimResponse;
export type CreateClaimPayload = CreateClaimRequest;
export type UpdateClaimPayload = UpdateClaimRequest;
