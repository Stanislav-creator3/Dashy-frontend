import { z } from "zod";

export const deleteProjectSchema = (name: string) =>
  z.object({
    name: z.string().refine((value) => value === name, {
      message: "Неверное название пространства",
    }),
  });

export type TypeDeleteProjectSchema = z.infer<
  ReturnType<typeof deleteProjectSchema>
>;
