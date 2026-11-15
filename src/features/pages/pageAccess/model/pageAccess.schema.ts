import { z } from "zod";

export const PAGE_ACCESS_NONE = "NONE";

export const pageAccessLevelSchema = z.enum([PAGE_ACCESS_NONE, "VIEW", "EDIT"]);

// access — уровень по id роли. «Нет доступа» на сервер не уходит: у роли просто нет строки
export const pageAccessSchema = z.object({
  inheritAccess: z.boolean(),
  access: z.record(z.string(), pageAccessLevelSchema),
});

export type TypePageAccessSchema = z.infer<typeof pageAccessSchema>;
export type TypePageAccessLevel = z.infer<typeof pageAccessLevelSchema>;
