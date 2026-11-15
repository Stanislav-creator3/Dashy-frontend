import { BASE_API_URL, KEYS_API } from "@/shared/config/api";
import { queryOptions } from "@tanstack/react-query";
import { IRole, IRoleBody } from "../model/role.types";

export const rolesApi = {
  getRoles: ({ projectId }: { projectId: string }) => {
    return queryOptions({
      queryKey: [KEYS_API.ROLES, projectId],
      queryFn: async ({ signal }): Promise<IRole[]> => {
        const response = await fetch(
          `${BASE_API_URL}/projects/${projectId}/roles`,
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

  createRole: async ({
    projectId,
    data,
  }: {
    projectId: string;
    data: IRoleBody;
  }): Promise<IRole> => {
    const response = await fetch(`${BASE_API_URL}/projects/${projectId}/roles`, {
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

  updateRole: async ({
    projectId,
    roleId,
    data,
  }: {
    projectId: string;
    roleId: string;
    data: IRoleBody;
  }): Promise<IRole> => {
    const response = await fetch(
      `${BASE_API_URL}/projects/${projectId}/roles/${roleId}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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

  deleteRole: async ({
    projectId,
    roleId,
  }: {
    projectId: string;
    roleId: string;
  }): Promise<IRole> => {
    const response = await fetch(
      `${BASE_API_URL}/projects/${projectId}/roles/${roleId}`,
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
