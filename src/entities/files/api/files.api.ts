import { BASE_API_URL } from "@/shared/config/api";

export const filesApi = {
  uploadImage: async ({
    file,
    pageId,
  }: {
    file: File;
    pageId: string;
  }): Promise<{ fileName: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${BASE_API_URL}/files/upload/${pageId}`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Ошибка сервера" }));
      throw new Error(errorData.message);
    }
    return await response.json();
  },
  remove: async (fileName: string): Promise<boolean> => {
    const query = new URLSearchParams({ fileName });
    const response = await fetch(`${BASE_API_URL}/files?${query}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Ошибка сервера" }));
      throw new Error(errorData.message);
    }
    return await response.json();
  },
};
