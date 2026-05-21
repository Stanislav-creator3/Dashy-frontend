"use client";

import { Button, Modal } from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  deleteProjectSchema,
  TypeDeleteProjectSchema,
} from "../model/delete-project.schema";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "@/entities/projects/api/projects.api";
import { TextField } from "@/shared/ui/textField/TextField";
import toast from "react-hot-toast";

export default function DeleteProjectForm() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: project, isLoading } = useQuery(projectsApi.getProject(id));
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: deleteProject, isPending } = useMutation({
    mutationFn: projectsApi.deleteProject,
    onSuccess: () => {
      setIsOpen(false);
      router.replace("/projects");
    },
    onError: (error) => {
      toast.error("Произошла ошибка:" + error, {
        position: "bottom-right",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(projectsApi.getProjects());
    },
  });

  if (isLoading || !project) return null;

  const form = useForm<TypeDeleteProjectSchema>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(deleteProjectSchema(project?.name ?? "")),
    defaultValues: {
      name: "",
    },
  });

  const { isValid, isDirty } = form.formState;

  const onSubmit = (data: TypeDeleteProjectSchema) => {
    if (data.name !== project.name) return;
    deleteProject(id);
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="mb-2">Удалить пространство</p>
        <p className="text-gray">
          Навсегда удалите это пространство вместе со всеми страницами и
          файлами.
        </p>
      </div>
      <div className="justify-self-end">
        <Button onClick={() => setIsOpen((prev) => !prev)} variant="danger">
          Удалить пространство
        </Button>
      </div>
      <Modal width="md" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="w-110 p-5">
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg font-bold text-center">
              Удалить все рабочее пространство без возможности восстановления?
            </p>
            <p className="text-gray text-center">
              Это действие нельзя отменить. Рабочее пространство, включая все
              страницы и файлы, будет удалено без возможности восстановления.
              Пожалуйста, введите название рабочего пространства для
              подтверждения.
            </p>
          </div>
          <form
            className="flex flex-col gap-3 mt-5"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Controller
              name="name"
              control={form.control}
              render={({ field }) => (
                <TextField
                  placeholder={project.name}
                  error={form.formState.errors.name?.message}
                  disabled={isLoading || isPending}
                  {...field}
                />
              )}
            />
            <Button
              className="mt-2"
              variant="danger"
              disabled={isLoading || isPending || !isValid || !isDirty}
            >
              Перманентно удалить пространство
            </Button>
            <Button type="button" onClick={() => setIsOpen(false)}>
              Отмена
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
