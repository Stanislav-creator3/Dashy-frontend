import { BASE_API_URL } from "@/shared/config/api";
import { IBlockCreate } from "../../model/block.types";

export const boardApi = {
  createColumn: async ({ id, data }: { id: string; data: IBlockCreate }) => {
    const response = await fetch(`${BASE_API_URL}/blocks/${id}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
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
