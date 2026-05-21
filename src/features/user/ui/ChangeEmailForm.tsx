"use client";

import { userApi } from "@/entities/user/api/user.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import {
  changeEmailSchema,
  TypeChangeEmailSchema,
} from "../model/change-email.schema";
import { TextField } from "@/shared/ui/textField/TextField";
import { Button } from "@/shared/ui";
import toast from "react-hot-toast";

export function ChangeEmailForm() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(userApi.getMe());
  const { mutate, isPending } = useMutation({
    mutationFn: userApi.changeEmail,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Email успешно изменен");
    },
    onSettled: () => {
      queryClient.invalidateQueries(userApi.getMe());
    },
  });

  const form = useForm<TypeChangeEmailSchema>({
    mode: "onChange",
    resolver: zodResolver(changeEmailSchema),
    values: {
      email: data?.email ?? "",
    },
  });

  const { isValid, isDirty } = form.formState;

  function onSubmit(data: TypeChangeEmailSchema) {
    mutate(data);
  }

  return isLoading ? (
    <ChangeEmailFormSkeleton />
  ) : (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
      <Controller
        name="email"
        control={form.control}
        render={({ field }) => (
          <TextField
            label="Email"
            placeholder="Email"
            {...field}
            error={form.formState.errors.email?.message}
            disabled={isLoading}
          />
        )}
      />
      <div className="flex justify-end">
        <Button disabled={!isValid || !isDirty || isPending}>Сохранить</Button>
      </div>
    </form>
  );
}

export function ChangeEmailFormSkeleton() {
  return <div className="animate-pulse h-64 w-full" />;
}
