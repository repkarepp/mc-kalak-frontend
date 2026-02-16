import { ClaimEvent, ClaimStatus } from "@/types/claim.types";
import { VoteType } from "@/types/voting.types";

export { ClaimEvent, ClaimStatus, VoteType };

// Event Labels
export const CLAIM_EVENT_LABELS: Record<ClaimEvent, string> = {
  [ClaimEvent.KING]: "King",
  [ClaimEvent.KONG]: "Kong",
  [ClaimEvent.NGOK]: "Ngok",
};

// Status Labels
export const CLAIM_STATUS_LABELS: Record<ClaimStatus, string> = {
  [ClaimStatus.PENDING]: "Pending",
  [ClaimStatus.FINAL_APPROVED]: "Approved",
  [ClaimStatus.FINAL_REJECTED]: "Rejected",
};

// Vote Type Labels
export const VOTE_TYPE_LABELS: Record<VoteType, string> = {
  [VoteType.APPROVE]: "Approve",
  [VoteType.REJECT]: "Reject",
};

// Validation Constants
export const CLAIM_VALIDATION = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 8,
  ALLOWED_EVENTS: [ClaimEvent.KING, ClaimEvent.KONG, ClaimEvent.NGOK],
};

// Image Upload Constants
export const IMAGE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp"],
};
