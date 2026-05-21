import { z } from "zod";

export const loginAccountSchema = z.object({
  email: z.email("Невалидный email"),
  password: z.string().min(6, "Минимальная длина пароля 6 символов"),
  pin: z.string().min(6).max(6).optional(),
});

export type TypeLoginAccountSchema = z.infer<typeof loginAccountSchema>;
