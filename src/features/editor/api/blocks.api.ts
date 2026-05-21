import { BASE_API_URL, KEYS_API } from "@/shared/config/api";
import { queryOptions } from "@tanstack/react-query";
import { IBlock, IBlockCreate, IBlockUpdate } from "../model/block.types";

export const blocksApi = {
  getBlocks: (id: string) => {
    return queryOptions({
      queryKey: [KEYS_API.BLOCKS, id],
      queryFn: async ({ signal }): Promise<IBlock[]> => {
        const response = await fetch(`${BASE_API_URL}/blocks/${id}`, {
          method: "GET",
          credentials: "include",
          signal,
        });

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: "Ошибка сервера" }));
          throw new Error(errorData.message);
        }

        return response.json();
      },
    });
  },

  createBlocks: async ({ id, data }: { id: string; data: IBlockCreate }) => {
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

  updateBlocks: async ({
    blocks,
    pageId,
  }: {
    blocks: IBlockUpdate[];
    pageId: string;
  }): Promise<{
    success: boolean;
    created: { tempId: string; id: string }[];
  }> => {
    const response = await fetch(`${BASE_API_URL}/blocks`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blocks, pageId }),
    });
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Ошибка сервера" }));
      throw new Error(errorData.message);
    }
    return await response.json();
  },

  updateBlockOrder: async ({
    body,
  }: {
    body: { id: string; order: number; parentId: string | null }[];
  }) => {
    const response = await fetch(`${BASE_API_URL}/blocks/order`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Ошибка сервера" }));
      throw new Error(errorData.message);
    }
    return await response.json();
  },

  deleteBlocks: async (id: string[]) => {
    const response = await fetch(`${BASE_API_URL}/blocks`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(id),
    });
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Ошибка сервера" }));
      throw new Error(errorData.message);
    }
    return await response.json();
  },

  updatePosition: async ({
    body,
  }: {
    body: { id: string; order: number; parentId: string | null }[];
  }) => {
    const response = await fetch(`${BASE_API_URL}/blocks/position`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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
