"use client";

import { useProjectRole } from "@/entities/projects/hooks/use-project-role";
import { rolesApi } from "@/entities/roles/api/roles.api";
import { PROJECT_ROLE_TYPE } from "@/entities/roles/model/role.types";
import RoleSelect from "@/entities/roles/ui/RoleSelect";
import { Button } from "@/shared/ui";
import { TextField } from "@/shared/ui/textField/TextField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAddMember } from "../hooks/use-add-member";
import { canAssignRole } from "../model/memberPermissions";
import { addMemberSchema, TypeAddMemberSchema } from "../model/addMember.schema";

export default function AddMemberForm({
  projectId,
  onSuccess,
}: {
  projectId: string;
  onSuccess?: () => void;
}) {
  const { role: actorRole } = useProjectRole(projectId);
  const { data: roles } = useQuery(rolesApi.getRoles({ projectId }));
  const { addMember, isPending } = useAddMember({ projectId });

  const form = useForm<TypeAddMemberSchema>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: { email: "", roleId: "" },
  });

  // Админ не увидит «Администратор», владельца выдать нельзя
  const availableRoles = (roles ?? []).filter((role) =>
    canAssignRole(actorRole?.type, role.type),
  );

  // По умолчанию — первая не системная роль («Участник»)
  const defaultRoleId = (
    availableRoles.find((role) => role.type === PROJECT_ROLE_TYPE.CUSTOM) ??
    availableRoles[0]
  )?.id;

  useEffect(() => {
    if (defaultRoleId && !form.getValues("roleId")) {
      form.setValue("roleId", defaultRoleId);
    }
  }, [defaultRoleId, form]);

  const onSubmit = (data: TypeAddMemberSchema) => {
    addMember(data, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
      onError: (error) => {
        form.setError("email", { message: error.message });
      },
    });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={form.control}
        render={({ field }) => (
          <TextField
            type="email"
            textSize="text-base"
            placeholder="Email участника"
            autoFocus
            error={form.formState.errors.email?.message}
            disabled={isPending}
            {...field}
          />
        )}
      />
      <Controller
        name="roleId"
        control={form.control}
        render={({ field }) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-3">
              <span className="text-text">Роль</span>
              <RoleSelect
                roles={availableRoles}
                value={field.value}
                onChange={field.onChange}
                disabled={isPending}
              />
            </div>
            {form.formState.errors.roleId && (
              <p className="text-sm text-red-500">
                {form.formState.errors.roleId.message}
              </p>
            )}
          </div>
        )}
      />
      <Button type="submit" disabled={isPending}>
        Добавить участника
      </Button>
    </form>
  );
}
