"use client";

import { pagesApi } from "@/entities/pages/api/pages.api";
import { IUpdatePageAccess } from "@/entities/pages/model/page.types";
import { KEYS_API } from "@/shared/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useUpdatePageAccess({
  projectId,
  pageId,
}: {
  projectId: string;
  pageId: string;
}) {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: (body: IUpdatePageAccess) =>
      pagesApi.updateAccess({ id: pageId, projectId, body }),
    onSuccess: (data) => {
      queryClient.setQueryData(
        pagesApi.getAccess({ id: pageId, projectId }).queryKey,
        data,
      );
      toast.success("Доступ сохранён", { position: "bottom-right" });
    },
    onError: (error) => {
      toast.error(error.message, { position: "bottom-right" });
    },
    onSettled: () => {
      // Сводка по всем страницам в настройках («Страницы»)
      queryClient.invalidateQueries({
        queryKey: pagesApi.getProjectAccess({ projectId }).queryKey,
        exact: true,
      });
      // У страниц в сайдбаре и в редакторе меняется access
      queryClient.invalidateQueries({ queryKey: [KEYS_API.PAGES] });
    },
  });

  return {
    updatePageAccess: mutate,
    updatePageAccessAsync: mutateAsync,
    isPending,
  };
}
