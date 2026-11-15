import { ACCESS_LEVEL } from "@/entities/pages/model/page.types";
import { z } from "zod";

export const pageAccessLevelSchema = z.enum(ACCESS_LEVEL);

// access — уровень по id роли. NONE на сервер не уходит: у роли просто нет строки
export const pageAccessSchema = z.object({
  inheritAccess: z.boolean(),
  access: z.record(z.string(), pageAccessLevelSchema),
});

export type TypePageAccessSchema = z.infer<typeof pageAccessSchema>;
