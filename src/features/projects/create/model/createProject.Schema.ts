import { z } from "zod";

const fileSizeLimit = 5 * 1024 * 1024; // 5MB

export const createProjectSchema = z.object({
  name: z.string().min(2, "Минимальная длина названия 2 символа"),
  image: z
    .instanceof(File)
    .optional()
    .or(z.null())
    .refine(
      (file) =>
        !file ||
        ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"].includes(
          file.type
        ),
      {
        message:
          "Неподдерживаемый формат изображения. Пожалуйста, загрузите изображение в одном из следующих форматов: JPEG, JPG, WEBP.",
      }
    )
    .refine((file) => !file || file.size <= fileSizeLimit, {
      message: "Максимальный размер изображение 5МБ",
    }),
});

export type TypeCreateProjectSchema = z.infer<typeof createProjectSchema>;
