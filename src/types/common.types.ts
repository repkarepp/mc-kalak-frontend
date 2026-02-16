// Base API Response structure
export interface BaseApiResponse<T = any> {
  status: boolean;
  message: string;
  timestamp: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  max_page: number;
  count: number;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface TimestampTemplate {
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface ApiError {
  status: boolean;
  message: string;
  timestamp: string;
  error?: string;
}

export type LoadingState = "idle" | "loading" | "success" | "error";
