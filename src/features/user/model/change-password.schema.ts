import { z } from "zod";

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6, "Минимальная длина пароля 6 символов"),
  newPassword: z.string().min(6, "Минимальная длина пароля 6 символов"),
});

export type TypeChangePasswordSchema = z.infer<typeof changePasswordSchema>;
