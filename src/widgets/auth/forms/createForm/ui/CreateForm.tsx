"use client";

import { TextField } from "@/shared/ui/textField/TextField";
import AuthWRapper from "@/widgets/auth/ui/AuthWrapper";
import { Controller, useForm } from "react-hook-form";
import {
  createAccountSchema,
  TypeCreateAccountSchema,
} from "../model/create.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/ui";
import { useMutation } from "@tanstack/react-query";
import { crateApi } from "../api/create.api";
import { useRouter } from "next/navigation";

export default function CreateForm() {
  const router = useRouter();

  const create = useMutation({
    mutationFn: crateApi.create,
  });
  const form = useForm<TypeCreateAccountSchema>({
    mode: "onChange",
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
    },
  });

  const onSubmit = (data: TypeCreateAccountSchema) => {
    create.mutate(
      {
        password: data.confirmPassword,
        username: data.username,
        email: data.email,
      },
      {
        onSuccess() {
          router.push("/account/login");
        },
      }
    );
  };

  const { isValid } = form.formState;
  return (
    <AuthWRapper
      heading="Регистрация"
      backButtonLabel={"Есть аккунт? Войти"}
      backButtonHref="/account/login"
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <Controller
          name="email"
          control={form.control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              placeholder="Email"
              error={form.formState.errors["email"]?.message}
            />
          )}
        />
        <Controller
          name="username"
          control={form.control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Ваше имя"
              placeholder="Ваше имя | никнейм"
              error={form.formState.errors["username"]?.message}
            />
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field }) => (
            <TextField
              {...field}
              type="password"
              label="Пароль"
              placeholder="********"
              error={form.formState.errors["password"]?.message}
            />
          )}
        />
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field }) => (
            <TextField
              {...field}
              type="password"
              label="Подвертите пароль"
              placeholder="********"
              error={form.formState.errors["confirmPassword"]?.message}
            />
          )}
        />
        {create.isError && (
          <p className="text-red-500">{create.error.message}</p>
        )}
        <Button disabled={!isValid} className="w-full" type="submit">
          Зарегистрироваться
        </Button>
      </form>
    </AuthWRapper>
  );
}
