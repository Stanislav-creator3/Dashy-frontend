import { z } from "zod";

export const createRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Введите название роли")
    .max(50, "Максимальная длина названия 50 символов"),
});

export type TypeCreateRoleSchema = z.infer<typeof createRoleSchema>;
