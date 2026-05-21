import { BASE_API_URL, KEYS_API } from "@/shared/config/api";
import { queryOptions } from "@tanstack/react-query";
import {
  ICollection,
  ICreateCollection,
  IUpdateCollection,
} from "../model/collection.types";

export const collectionsApi = {
  getCollections: (id: string) => {
    return queryOptions({
      queryKey: [KEYS_API.COLLECTIONS],
      queryFn: async ({ signal }): Promise<ICollection[]> => {
        const response = await fetch(`${BASE_API_URL}/collections/all/${id}`, {
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

  getCollectionById: (id: string) => {
    return queryOptions({
      queryKey: [KEYS_API.COLLECTIONS, id],
      queryFn: async ({ signal }) => {
        const response = await fetch(`${BASE_API_URL}/collections/${id}`, {
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

  createCollections: async (data: ICreateCollection) => {
    const response = await fetch(`${BASE_API_URL}/collections`, {
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

  deleteCollection: async (id: string) => {
    const response = await fetch(`${BASE_API_URL}/collections/${id}`, {
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

  updataCollection: async ({
    id,
    body,
  }: {
    id: string;
    body: IUpdateCollection;
  }) => {
    const response = await fetch(`${BASE_API_URL}/collections/${id}`, {
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
