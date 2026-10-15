"use client";

import { useMutation } from "@tanstack/react-query";
import { pagesApi } from "../api/pages.api";

export function useCreatePageCard() {
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: pagesApi.createPageCard,
  });

  return { mutate, isPending, isSuccess };
}
