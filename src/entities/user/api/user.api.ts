import { BASE_API_URL, KEYS_API } from "@/shared/config/api";
import { queryOptions } from "@tanstack/react-query";
import { u } from "motion/react-client";
import { IUser } from "../model/user.types";

export const userApi = {
  getMe: () => {
    return queryOptions({
      queryKey: [KEYS_API.ACCOUNT],
      queryFn: async ({ signal }) : Promise<IUser> => {
        const response = await fetch(`${BASE_API_URL}/auth`, {
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
  updateUser: async (body: { username: string }) => {
    const response = await fetch(`${BASE_API_URL}/profile/change-info`, {
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

  changeAvatar: async (body: { file: File }) => {
    const formData = new FormData();

    if (body.file) {
      formData.append("file", body.file);
    }
    const response = await fetch(`${BASE_API_URL}/profile/change-avatar`, {
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

  deleteAvatar: async () => {
    const response = await fetch(`${BASE_API_URL}/profile/remove-avatar`, {
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

  changeEmail: async (body: { email: string }) => {
    const response = await fetch(`${BASE_API_URL}/profile/change-email`, {
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

  changePassword: async (body: {
    oldPassword: string;
    newPassword: string;
  }) => {
    const response = await fetch(`${BASE_API_URL}/profile/change-password`, {
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
