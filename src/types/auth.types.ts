import type { TimestampTemplate } from "./common.types";

// Login Request
export interface LoginRequest {
  username: string;
  password: string;
}

// Login Response
export interface LoginResponse {
  token: string;
}

// User Response (Full Profile)
export interface UserResponse extends TimestampTemplate {
  id: string; // UUID as string
  username: string;
  password: string;
  avatar_url: string;
  is_active: boolean;
}

// User Simple Response (untuk nested data)
export interface UserSimpleResponse {
  id: string; // UUID as string
  username: string;
  avatar_url: string;
}

// Update Profile Request
export interface UpdateProfileRequest {
  avatar_url: string;
}

// Auth State
export interface AuthState {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Alias untuk backward compatibility
export type User = UserResponse;
export type PlayerInfo = UserSimpleResponse;
export type LoginCredentials = LoginRequest;
export type UpdateProfilePayload = UpdateProfileRequest;
