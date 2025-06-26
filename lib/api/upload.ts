import { apiClient } from "./axios";

export const UploadAPI = {
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient.post("/uploads/temp-media", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};
