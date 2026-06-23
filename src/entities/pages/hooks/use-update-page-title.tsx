"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pagesApi } from "../api/pages.api";

export function useUpdatePageTitle({
  projectId,
  parentId,
  pageId,
}: {
  projectId: string;
  parentId: string | null;
  pageId: string;
}) {
  const queryClient = useQueryClient();

  const { mutate: mutateUpdateDocument } = useMutation({
    mutationFn: pagesApi.updatePage,
    onMutate: (data) => {
      queryClient.cancelQueries({
        queryKey: pagesApi.getPageList({ projectId }).queryKey,
      });

      const prevList = queryClient.getQueryData(
        pagesApi.getPageList({ projectId }).queryKey,
      );

      if (data.body.title !== "undefined") {
        queryClient.setQueryData(
          pagesApi.getPageList({ projectId }).queryKey,
          (list) => {
            return list?.map((item) => {
              if (item.id === pageId) {
                return {
                  ...item,
                  title: data.body.title!,
                };
              }
              return item;
            });
          },
        );
        queryClient.setQueryData(
          pagesApi.getByIdPage({ id: pageId, projectId }).queryKey,
          (item) => {
            console.log(item);
            if (!item) return;
            return {
              ...item,
              title: data.body.title!,
            };
          },
        );
      }

      return { prevList };
    },
    onError: (_, __, context) => {
      if (!context) return;

      queryClient.setQueryData(
        pagesApi.getPageList({ projectId, parentId }).queryKey,
        context.prevList,
      );
    },
    onSettled: () => {
      if (parentId) {
        queryClient.invalidateQueries(
          pagesApi.getByIdPage({
            id: parentId,
            projectId,
          }),
        );
      }
      queryClient.invalidateQueries(pagesApi.getPageList({ projectId }));
      queryClient.invalidateQueries(
        pagesApi.getByIdPage({ id: pageId, projectId }),
      );
    },
  });

  return {
    handleUpdate: mutateUpdateDocument,
  };
}
