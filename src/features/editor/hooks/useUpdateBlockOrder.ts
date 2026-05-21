"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { blocksApi } from "../api/blocks.api";
import { pagesApi } from "@/entities/pages/api/pages.api";

export function useUpdateBlockOrder({
  pageId,
  projectId,
}: {
  pageId: string;
  projectId: string;
}) {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: blocksApi.updateBlockOrder,

    onSettled: () => {
      queryClient.invalidateQueries(
        pagesApi.getByIdPage({
          id: pageId,
          projectId,
        }),
      );
    },
  });

  return { mutate, isPending, isSuccess };
}
