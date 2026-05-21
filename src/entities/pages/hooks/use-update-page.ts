"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pagesApi } from "../api/pages.api";

export function useUpdatePage({ pageId, projectId }: { pageId: string, projectId: string }) {
  const queryClient = useQueryClient();

  const mutateUpdateDocument = useMutation({
    mutationFn: pagesApi.updatePage,

    onSettled: () => {
      queryClient.invalidateQueries(pagesApi.getByIdPage({
        id: pageId,
        projectId,
      }));
    },
  });

  return {
    handleUpdate: mutateUpdateDocument.mutate,
    isPending:
      mutateUpdateDocument.isPending &&
      mutateUpdateDocument.variables.id === pageId,
  };
}
