import { z } from "zod";

export const editCollectionSchema = z.object({
  title: z.string().min(2, "Минимальная длина названия 2 символа").optional(),
  description: z
    .union([
      z.string().length(0),
      z.string().min(2, "Минимальная длина описания 2 символа").max(400),
    ])
    .optional(),
  icon: z.string().optional(),
  iconColor: z.string().optional(),
});

export type TypeEditCollectionSchema = z.infer<typeof editCollectionSchema>;
