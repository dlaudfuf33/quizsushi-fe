import { apiClient } from "./axios";

export const UploadAPI = {
  async uploadFiletoTmp(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post("/uploads/temp-media", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async uploadFileToQuizFolder(file: File, mediaKey: string) {
    const form = new FormData();
    form.append("file", file);
    form.append("mediaKey", mediaKey);
    const res = await apiClient.post("/uploads/quiz-media", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};
