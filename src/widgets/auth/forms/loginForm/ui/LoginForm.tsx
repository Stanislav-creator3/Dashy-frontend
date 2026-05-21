"use client";

import { TextField } from "@/shared/ui/textField/TextField";
import AuthWRapper from "@/widgets/auth/ui/AuthWrapper";
import { Controller, useForm } from "react-hook-form";
import {
  loginAccountSchema,
  TypeLoginAccountSchema,
} from "../model/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/ui";
import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../api/login.api";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const login = useMutation({
    mutationFn: loginApi.login,
    onSuccess() {
      router.push("/");
    },
  });
  const form = useForm<TypeLoginAccountSchema>({
    mode: "onChange",
    resolver: zodResolver(loginAccountSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isValid } = form.formState;

  const onSubmit = (data: TypeLoginAccountSchema) => {
    login.mutateAsync(data);
  };
  return (
    <AuthWRapper
      heading="Авторизация"
      backButtonLabel={"Нету аккунта? Регистрация"}
      backButtonHref="/account/create"
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
        {login.isError && <p className="text-red-500">{login.error.message}</p>}
        <Button disabled={!isValid} className="w-full" type="submit">
          Войти
        </Button>
      </form>
    </AuthWRapper>
  );
}
