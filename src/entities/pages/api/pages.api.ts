import { BASE_API_URL, KEYS_API } from "@/shared/config/api";
import { queryOptions } from "@tanstack/react-query";
import {
  ICreatePage,
  IPage,
  IPageList,
  IUpdatePage,
} from "../model/page.types";

export const pagesApi = {
  getAllPages: ({ projectId, id }: { projectId: string; id: string }) => {
    return queryOptions({
      queryKey: [KEYS_API.PAGES],
      queryFn: async ({ signal }): Promise<IPage[]> => {
        const response = await fetch(
          `${BASE_API_URL}/${projectId}/pages/${id}`,
          {
            method: "GET",
            credentials: "include",
            signal,
          },
        );

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

  getByIdPage: ({ id, projectId }: { id: string; projectId: string }) => {
    return queryOptions({
      queryKey: [KEYS_API.PAGES, id],
      queryFn: async ({ signal }): Promise<IPage> => {
        const response = await fetch(
          `${BASE_API_URL}/${projectId}/pages/${id}`,
          {
            method: "GET",
            credentials: "include",
            signal,
          },
        );

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

  getPageList: ({
    projectId,
    parentId = null,
  }: {
    projectId: string;
    parentId?: string | null;
  }) => {
    return queryOptions({
      queryKey: [KEYS_API.PAGES, projectId, parentId],
      queryFn: async ({ signal }): Promise<IPageList[]> => {
        const params = parentId ? `?parentId=${parentId}` : "";
        const response = await fetch(
          `${BASE_API_URL}/${projectId}/pages${params}`,
          {
            method: "GET",
            credentials: "include",
            signal,
          },
        );
        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: "Ошибка сервера" }));
          throw new Error(errorData.message);
        }
        return await response.json();
      },
    });
  },

  getRecentPages: ({ projectId }: { projectId: string }) => {
    return queryOptions({
      queryKey: [KEYS_API.RECENT_PAGES, projectId],
      staleTime: 30_000,
      refetchOnMount: true,
      queryFn: async ({ signal }): Promise<IPage[]> => {
        const response = await fetch(
          `${BASE_API_URL}/${projectId}/pages/visit`,
          {
            method: "GET",
            credentials: "include",
            signal,
          },
        );
        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: "Ошибка сервера" }));
          throw new Error(errorData.message);
        }
        return await response.json();
      },
    });
  },

  createPage: async ({
    projectId,
    data,
  }: {
    projectId: string;
    data: ICreatePage;
  }) => {
    const response = await fetch(`${BASE_API_URL}/${projectId}/pages`, {
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

  deletePage: async ({ id, projectId }: { id: string; projectId: string }) => {
    const response = await fetch(`${BASE_API_URL}/${projectId}/pages/${id}`, {
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

  updatePage: async ({
    id,
    projectId,
    body,
  }: {
    id: string;
    projectId: string;
    body: IUpdatePage;
  }) => {
    const response = await fetch(`${BASE_API_URL}/${projectId}/pages/${id}`, {
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

  reorderPages: async ({
    projectId,
    pages,
  }: {
    projectId: string;
    pages: Array<{ id: string; parentId: string | null; position: number }>;
  }) => {
    const response = await fetch(`${BASE_API_URL}/${projectId}/pages/reorder`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pages }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Ошибка сервера" }));
      throw new Error(errorData.message);
    }
    return response.json();
  },

  changeCover: async ({
    pageId,
    projectId,
    file,
  }: {
    pageId: string;
    projectId: string;
    file: File | null;
  }) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${BASE_API_URL}/${projectId}/pages/cover/${pageId}`,
      {
        method: "PATCH",
        credentials: "include",
        body: formData,
      },
    );
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Ошибка сервера" }));
      throw new Error(errorData.message);
    }
    return await response.json();
  },

  deleteCover: async ({
    pageId,
    projectId,
  }: {
    pageId: string;
    projectId: string;
  }) => {
    const response = await fetch(
      `${BASE_API_URL}/${projectId}/pages/cover/${pageId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Ошибка сервера" }));
      throw new Error(errorData.message);
    }
    return await response.json();
  },

  changeIcon: async ({
    id,
    projectId,
    file,
  }: {
    id: string;
    projectId: string;
    file: File | null;
  }) => {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }

    const response = await fetch(
      `${BASE_API_URL}/${projectId}/pages/icon/${id}`,
      {
        method: "PATCH",
        credentials: "include",
        body: formData,
      },
    );
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Ошибка сервера" }));
      throw new Error(errorData.message);
    }
    return await response.json();
  },

  deleteIcon: async ({ id, projectId }: { id: string; projectId: string }) => {
    const response = await fetch(
      `${BASE_API_URL}/${projectId}/pages/icon/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Ошибка сервера" }));
      throw new Error(errorData.message);
    }
    return await response.json();
  },
};
