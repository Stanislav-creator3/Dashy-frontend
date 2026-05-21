import { BASE_API_URL } from "@/shared/config/api";

interface ILogin {
  email: string;
  password: string;
}

export const loginApi = {
  login: async (body: ILogin) => {
    const response = await fetch(`${BASE_API_URL}/session/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Ошибка сервера" }));
      throw new Error(errorData.message);
    }

    return response.json();
  },
};
