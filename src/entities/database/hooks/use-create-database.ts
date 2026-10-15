"use client";
import { useMutation } from "@tanstack/react-query";
import { databaseApi } from "../api/database.api";

export function useCreateDatabase() {
  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: databaseApi.create,
  });

  return { mutateAsync, isPending, isSuccess };
}
