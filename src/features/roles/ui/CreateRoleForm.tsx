"use client";

import { Button } from "@/shared/ui";
import { TextField } from "@/shared/ui/textField/TextField";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useCreateRole } from "../hooks/use-create-role";
import { createRoleSchema, TypeCreateRoleSchema } from "../model/role.schema";

export default function CreateRoleForm({
  projectId,
  onSuccess,
}: {
  projectId: string;
  onSuccess?: () => void;
}) {
  const { createRole, isPending } = useCreateRole({ projectId });

  const form = useForm<TypeCreateRoleSchema>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: { name: "" },
  });

  const onSubmit = ({ name }: TypeCreateRoleSchema) => {
    createRole(name, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  };

  return (
    <form
      className="flex items-start gap-2 pb-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Controller
        name="name"
        control={form.control}
        render={({ field }) => (
          <TextField
            textSize="text-base"
            placeholder="Название новой роли"
            error={form.formState.errors.name?.message}
            disabled={isPending}
            {...field}
          />
        )}
      />
      <Button type="submit" className="shrink-0" disabled={isPending}>
        Создать роль
      </Button>
    </form>
  );
}
