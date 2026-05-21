import { BASE_API_URL, KEYS_API } from "@/shared/config/api";
import { queryOptions } from "@tanstack/react-query";
import { Cover } from "../model/types";

export const coverApi = {
  getCover: () => {
    return queryOptions({
      queryKey: [KEYS_API.COVER],
      queryFn: async ({ signal }): Promise<Cover[]> => {
        const response = await fetch(
          `${BASE_API_URL}/cover`,
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
};
