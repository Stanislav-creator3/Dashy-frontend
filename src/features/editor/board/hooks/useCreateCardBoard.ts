"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { databaseApi } from "@/entities/database/api/database.api";

export const useCreateCardBoard = ({
  projectId,
  databaseId,
  groupByFieldId,
}: {
  projectId: string;
  databaseId: string;
  groupByFieldId: string;
}) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (columnId: string) =>
      databaseApi.createRow({
        projectId,
        databaseId,
        data: {
          title: "Новая карточка",
          cells: groupByFieldId
            ? [{ fieldId: groupByFieldId, value: columnId }]
            : [],
        },
      }),
    onSuccess: (row) => {
      queryClient.setQueryData(
        databaseApi.getById({ id: databaseId, projectId }).queryKey,
        (database) =>
          database
            ? { ...database, rows: [...(database.rows ?? []), row] }
            : database,
      );
    },
  });

  return { createCard: mutateAsync, isPending };
};
