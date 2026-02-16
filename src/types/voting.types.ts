import type { TimestampTemplate } from "./common.types";
import type { UserSimpleResponse } from "./auth.types";
import type { ClaimStatus } from "./claim.types";

// Vote Type Enum (sesuai dengan backend: APPROVE, REJECT)
export const VoteType = {
  APPROVE: "APPROVE",
  REJECT: "REJECT",
} as const;
export type VoteType = (typeof VoteType)[keyof typeof VoteType];

// Claim Vote Request
export interface ClaimVoteRequest {
  type: VoteType; // 'APPROVE' or 'REJECT'
}

// Claim Vote Response
export interface ClaimVoteResponse extends TimestampTemplate {
  id: string; // UUID as string
  voter: UserSimpleResponse;
  type: VoteType;
}

// Vote Stats (untuk kalkulasi di frontend)
export interface VoteStats {
  approve: number;
  reject: number;
  total: number;
  totalParticipants: number;
  approvalPercentage: number;
  rejectionPercentage: number;
}

// Submit Vote Response (dari backend setelah vote)
export interface SubmitVoteResponse {
  vote: ClaimVoteResponse;
  claim_status?: ClaimStatus;
  approve_count?: number;
  reject_count?: number;
  message?: string;
}

// Votes List Response
export interface VotesListResponse {
  votes: ClaimVoteResponse[];
  total?: number;
}

// Voting State
export interface VotingState {
  votes: Record<string, ClaimVoteResponse[]>;
  loading: boolean;
  error: string | null;
  votingInProgress: boolean;
}

// Voting Decision Result
export interface VotingDecision {
  reached: boolean;
  type: "approve" | "reject" | null;
  percentage: number;
}

// Alias untuk backward compatibility
export type Vote = ClaimVoteResponse;
export type SubmitVotePayload = ClaimVoteRequest;
