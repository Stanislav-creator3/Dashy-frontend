"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  createProjectSchema,
  TypeCreateProjectSchema,
} from "../model/createProject.Schema";
import { TextField } from "@/shared/ui/textField/TextField";
import { Button, Card, TextArea, Upload } from "@/shared/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "@/entities/projects/api/projects.api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CreateProjectForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: projectsApi.createProject,
  });
  const { formState, control, handleSubmit } = useForm<TypeCreateProjectSchema>(
    {
      resolver: zodResolver(createProjectSchema),
      mode: "onChange",
      defaultValues: {
        name: "",
      },
    },
  );

  const onSubmit = (data: TypeCreateProjectSchema) => {
    mutate(
      {
        name: data.name,
        image: data.image as File,
      },
      {
        onSuccess(dataProject) {
          toast.success(`Пространство ${dataProject.name}, успешно создан.`);
          router.push(`/projects/${dataProject.id}`);
        },
        onError(err: Error) {
          toast.error(err.message);
        },
        onSettled() {
          queryClient.invalidateQueries(projectsApi.getProjects());
        },
      },
    );
  };

  const { isValid } = formState;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col gap-5 p-5"
    >
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            id="name"
            label="Название пространство"
            placeholder="Название пространство"
            error={formState.errors["name"]?.message}
          />
        )}
      />
      <p className="text-2xl">Загрузите иконку для вашего пространства</p>

      <Controller
        name="image"
        control={control}
        render={({ field }) => (
          <Upload
            {...field}
            isLoading={isPending}
            className="h-50"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Button
        isLoading={isPending}
        disabled={!isValid || isPending}
        className="w-full"
        type="submit"
      >
        Создать
      </Button>
    </form>
  );
}
