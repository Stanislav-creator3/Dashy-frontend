"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pagesApi } from "../api/pages.api";

export function useDeleteIcon({
  pageId,
  projectId,
  parentId,
}: {
  pageId: string;
  projectId: string;
  parentId: string | null;
}) {
  const queryClient = useQueryClient();
  const { mutate: deleteIcon, isPending } = useMutation({
    mutationFn: pagesApi.deleteIcon,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: pagesApi.getByIdPage({ id: pageId, projectId }).queryKey,
      });

      const previousData = queryClient.getQueryData(
        pagesApi.getByIdPage({ id: pageId, projectId }).queryKey,
      );

      queryClient.setQueryData(
        pagesApi.getByIdPage({ id: pageId, projectId }).queryKey,
        (data) => {
          if (!data) return;
          return {
            ...data,
            icon: null,
          };
        },
      );
      queryClient.setQueryData(
        pagesApi.getPageList({ projectId, parentId }).queryKey,
        (list) => {
          console.log(list)
          return list?.map((item) => {
            if (item.id === pageId) {
              return {
                ...item,
                icon: null,
              };
            }
            return item;
          });
        },
      );

      return { previousData };
    },
    onError(_, __, context) {
      if (!context) return;
      queryClient.setQueryData(
        pagesApi.getByIdPage({ id: pageId, projectId }).queryKey,
        context.previousData,
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(
        pagesApi.getByIdPage({ id: pageId, projectId }),
      );
    },
  });

  return { deleteIcon, isPending };
}
