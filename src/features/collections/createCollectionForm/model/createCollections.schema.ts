import { z } from "zod";

export const createCollectionSchema = z.object({
  title: z.string().min(2, "Минимальная длина названия 2 символа"),
  description: z
    .string()
    .min(2, "Минимальная длина описания  2 символа")
    .max(400)
    .optional(),
  icon: z.string().optional(),
  iconColor: z.string().optional(),
});

export type TypeCreateCollectionSchema = z.infer<typeof createCollectionSchema>;
