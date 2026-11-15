import { z } from "zod";

export const addMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Введите email")
    .toLowerCase()
    .pipe(z.email("Невалидный email")),
  roleId: z.string().min(1, "Выберите роль"),
});

export type TypeAddMemberSchema = z.infer<typeof addMemberSchema>;
