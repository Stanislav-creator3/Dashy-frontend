import { BASE_API_URL, KEYS_API } from "@/shared/config/api";
import { queryOptions } from "@tanstack/react-query";

export const timerTrackerApi = {
  getTimerTrackerQueryOptions: () => {
    return queryOptions({
      queryKey: [KEYS_API.TIME_TRACKER],
      queryFn: async ({ signal }) => {
        const response = await fetch(`${BASE_API_URL}/working-hours`, {
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
  startTimer: async (body: { dateStart: Date }) => {
    const response = await fetch(`${BASE_API_URL}/working-hours`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Ошибка сервера" }));
      throw new Error(errorData.message);
    }

    return response.json();
  },

  stopTimer: async (body: { id: string; datePause: Date }) => {
    const response = await fetch(`${BASE_API_URL}/working-hours`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Ошибка сервера" }));
      throw new Error(errorData.message);
    }

    return response.json();
  },
};
