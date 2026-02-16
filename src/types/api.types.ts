import type { AxiosRequestConfig } from "axios";

export interface ApiRequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  skipErrorHandler?: boolean;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Response dari upload sesuai dengan API Anda
export interface UploadResponse {
  file_path: string; // "uploads/ad78dbeb-3dc6-4522-bb55-a651a6d8e06f.png"
}
