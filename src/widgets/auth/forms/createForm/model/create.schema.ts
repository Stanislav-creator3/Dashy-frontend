import { z } from "zod";

export const createAccountSchema = z
  .object({
    email: z.email("Невалидный email"),
    password: z.string().min(6, "Минимальная длина пароля 6 символов"),
    confirmPassword: z
      .string()
      .min(6, "Подтвердите пароль, состоящий как минимум из 6 символов"),
    username: z.string().min(2, "Минимальная длина 2 символа"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают!",
    path: ["confirmPassword"],
  });

export type TypeCreateAccountSchema = z.infer<typeof createAccountSchema>;
