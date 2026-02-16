export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Response dari upload (berdasarkan response API Anda)
// Backend return: "uploads/ad78dbeb-3dc6-4522-bb55-a651a6d8e06f.png"
export interface UploadResponse {
  file_path: string;
}

export interface UploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
}
