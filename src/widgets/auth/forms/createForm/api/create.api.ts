import { BASE_API_URL } from "@/shared/config/api";

interface ICreate {
  email: string;
  username: string;
  password: string;
}

export const crateApi = {
  create: async (body: ICreate) => {
    const response = await fetch(`${BASE_API_URL}/auth`, {
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
};
