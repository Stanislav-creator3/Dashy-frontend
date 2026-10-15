import { BASE_API_URL, KEYS_API } from "@/shared/config/api";
import { queryOptions, skipToken } from "@tanstack/react-query";
import {
  IDatabase,
  IDatabaseCell,
  IDatabaseField,
  IDatabaseFieldConfig,
  IDatabaseRow,
  IDatabaseRowProps,
} from "../model/database.type";

export const databaseApi = {
  getById: ({ id, projectId }: { id?: string; projectId: string }) => {
    return queryOptions({
      queryKey: [KEYS_API.DATABASE, id],
      queryFn:
        !id || !projectId
          ? skipToken
          : async ({ signal }): Promise<IDatabase> => {
              const response = await fetch(
                `${BASE_API_URL}/${projectId}/database/${id}`,
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

  updateDatabase: async ({
    projectId,
    databaseId,
    data,
  }: {
    projectId: string;
    databaseId: string;
    data: { name: string };
  }): Promise<IDatabase> => {
    const response = await fetch(
      `${BASE_API_URL}/${projectId}/database/${databaseId}`,
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

  create: async ({
    projectId,
    data,
  }: {
    projectId: string;
    data: { name: string; blockId: string };
  }): Promise<IDatabase> => {
    const response = await fetch(`${BASE_API_URL}/${projectId}/database`, {
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

  createRow: async ({
    projectId,
    databaseId,
    data,
  }: {
    projectId: string;
    databaseId: string;
    data: {
      title?: string;
      cells?: { fieldId: string; value: string | null }[];
    };
  }): Promise<IDatabaseRow> => {
    const response = await fetch(
      `${BASE_API_URL}/${projectId}/database/${databaseId}/rows`,
      {
        method: "POST",
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

  updateRow: async ({
    projectId,
    databaseId,
    rowId,
    data,
  }: {
    projectId: string;
    databaseId: string;
    rowId: string;
    data: {
      title?: string;
      position?: number;
      cells?: { fieldId: string; value: string | null }[];
      props?: IDatabaseRowProps;
    };
  }): Promise<IDatabaseRow> => {
    const response = await fetch(
      `${BASE_API_URL}/${projectId}/database/${databaseId}/rows/${rowId}`,
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

  createField: async ({
    projectId,
    databaseId,
    rowId,
    data,
  }: {
    projectId: string;
    databaseId: string;
    rowId: string;
    data: {
      title?: string;
      position?: number;
      props?: IDatabaseRowProps;
    };
  }): Promise<IDatabaseField> => {
    const response = await fetch(
      `${BASE_API_URL}/${projectId}/database/${databaseId}/fields`,
      {
        method: "POST",
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
  updateField: async ({
    projectId,
    databaseId,
    fieldId,
    data,
  }: {
    projectId: string;
    databaseId: string;
    fieldId: string;
    data: {
      title?: string;
      position?: number;
      config?: IDatabaseFieldConfig;
    };
  }) => {
    const response = await fetch(
      `${BASE_API_URL}/${projectId}/database/${databaseId}/fields/${fieldId}`,
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

  deleteFieldOption: async ({
    projectId,
    databaseId,
    fieldId,
    optionsId,
    moveToId,
  }: {
    projectId: string;
    databaseId: string;
    fieldId: string;
    optionsId: string;
    moveToId?: string | null;
  }) => {
    const query = moveToId ? `?moveTo=${moveToId}` : "";
    const response = await fetch(
      `${BASE_API_URL}/${projectId}/database/${databaseId}/fields/${fieldId}/options/${optionsId}${query}`,
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
