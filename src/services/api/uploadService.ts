import type { AxiosResponse } from "axios";
import type { UploadProgress } from "@/types/api.types";
import type { BaseApiResponse } from "@/types/common.types";
import apiClient from "./axiosInstance";

export default {
  uploadScreenshot(
    file: File,
    onUploadProgress?: (progress: UploadProgress) => void,
  ): Promise<AxiosResponse<BaseApiResponse<string>>> {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient.post<BaseApiResponse<string>>("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onUploadProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage,
          });
        }
      },
    });
  },

  deleteScreenshot(
    fileUrl: string,
  ): Promise<AxiosResponse<BaseApiResponse<void>>> {
    return apiClient.delete<BaseApiResponse<void>>("/upload", {
      data: { file_url: fileUrl },
    });
  },
};
