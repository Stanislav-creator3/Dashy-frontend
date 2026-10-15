"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pagesApi } from "../api/pages.api";
import { databaseApi } from "@/entities/database/api/database.api";

export function useUpdatePageTitleCard({
  projectId,
  pageId,
  databaseId,
}: {
  projectId: string;
  databaseId: string;
  pageId: string;
}) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: pagesApi.updatePage,
    onMutate: (data) => {
      queryClient.cancelQueries({
        queryKey: pagesApi.getPageList({ projectId }).queryKey,
      });

      const prevDatabase = queryClient.getQueryData(
        databaseApi.getById({ id: databaseId, projectId }).queryKey,
      );
      const prevPage = queryClient.getQueryData(
        pagesApi.getByIdPage({ id: pageId, projectId }).queryKey,
      );

      if (data.body.title !== "undefined") {
        queryClient.setQueryData(
          databaseApi.getById({ id: databaseId, projectId }).queryKey,
          (database) => {
            database
              ? {
                  ...database,
                  rows: database?.rows.map((row) =>
                    row.pageId === pageId
                      ? { ...row, title: data.body.title! }
                      : row,
                  ),
                }
              : database;
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

      return { prevDatabase, prevPage };
    },
    onError: (_, __, context) => {
      if (!context) return;

      queryClient.setQueryData(
        databaseApi.getById({ id: databaseId, projectId }).queryKey,
        context.prevDatabase,
      );

      queryClient.setQueryData(
        pagesApi.getByIdPage({ id: pageId, projectId }).queryKey,
        context.prevPage,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(
        pagesApi.getByIdPage({ id: pageId, projectId }),
      );
      queryClient.invalidateQueries(
        databaseApi.getById({ id: databaseId, projectId }),
      );
    },
  });

  return {
    handleUpdateTitleCard: mutate,
  };
}
