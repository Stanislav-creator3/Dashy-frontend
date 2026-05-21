import { BASE_API_URL, KEYS_API } from "@/shared/config/api";
import { queryOptions } from "@tanstack/react-query";
import { ICreateProject, IProject } from "../model/project.types";

export const projectsApi = {
  getProjects: () => {
    return queryOptions({
      queryKey: [KEYS_API.PROJECTS],
      queryFn: async ({ signal }): Promise<IProject[]> => {
        const response = await fetch(`${BASE_API_URL}/projects`, {
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
  getProject: (id: string) => {
    return queryOptions({
      queryKey: [KEYS_API.PROJECTS, id],
      queryFn: async ({ signal }): Promise<IProject> => {
        const response = await fetch(`${BASE_API_URL}/projects/${id}`, {
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

  createProject: async (data: ICreateProject) => {
    const formData = new FormData();

    formData.append("name", data.name);
    if (data.image) {
      formData.append("file", data.image);
    }

    const response = await fetch(`${BASE_API_URL}/projects`, {
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

  updateProject: async ({
    id,
    data,
  }: {
    id: string;
    data: { name?: string; icon?: string };
  }) => {
    const response = await fetch(`${BASE_API_URL}/projects/${id}`, {
      method: "PATCH",
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

  deleteProject: async (id: string) => {
    const response = await fetch(`${BASE_API_URL}/projects/${id}`, {
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

  changeIcon: async ({ id, file }: { id: string; file: File | null }) => {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }

    const response = await fetch(`${BASE_API_URL}/projects/${id}/icon`, {
      method: "PATCH",
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

  deleteIcon: async (id: string) => {
    const response = await fetch(`${BASE_API_URL}/projects/${id}/icon`, {
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
