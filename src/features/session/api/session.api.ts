import { BASE_API_URL } from "@/shared/config/api";

export const sessionApi = {
  logout: async () => {
    const response = await fetch(`${BASE_API_URL}/session/logout`, {
      method: "POST",
      credentials: "include",
    });
    return response.json();
  },
};
