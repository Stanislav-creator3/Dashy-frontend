"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  changePasswordSchema,
  TypeChangePasswordSchema,
} from "../model/change-password.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/entities/user/api/user.api";
import { TextField } from "@/shared/ui/textField/TextField";
import { Button, Separator } from "@/shared/ui";

export function ChangePasswordForm() {
  const queryClient = useQueryClient();
  const { isLoading } = useQuery(userApi.getMe());
  const { mutate, isPending } = useMutation({
    mutationFn: userApi.changePassword,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Пароль успешно изменен");
    },
    onSettled: () => {
      queryClient.invalidateQueries(userApi.getMe());
    },
  });

  const form = useForm<TypeChangePasswordSchema>({
    mode: "onChange",
    resolver: zodResolver(changePasswordSchema),
    values: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const { isValid } = form.formState;

  function onSubmit(data: TypeChangePasswordSchema) {
    mutate(data);
  }

  return isLoading ? (
    <ChangePasswordFormSkeleton />
  ) : (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
      <Controller
        control={form.control}
        name="oldPassword"
        render={({ field }) => (
          <TextField
            label="Старый пароль"
            type="password"
            disabled={isPending}
            placeholder="*********"
            error={form.formState.errors.oldPassword?.message}
            {...field}
          />
        )}
      />
      <Controller
        control={form.control}
        name="newPassword"
        render={({ field }) => (
          <TextField
            label="Новый пароль"
            type="password"
            disabled={isPending}
            placeholder="*********"
            error={form.formState.errors.newPassword?.message}
            {...field}
          />
        )}
      />
      <div className="flex justify-end p-5">
        <Button disabled={!isValid || isPending}>Сохранить</Button>
      </div>
    </form>
  );
}

export function ChangePasswordFormSkeleton() {
  return <div className="animate-pulse h-96 w-full" />;
}
