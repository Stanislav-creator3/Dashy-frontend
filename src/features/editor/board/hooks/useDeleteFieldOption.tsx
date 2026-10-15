"use client";

import { databaseApi } from "@/entities/database/api/database.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteFieldOptions = ({
  databaseId,
  projectId,
}: {
  databaseId: string;
  projectId: string;
}) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: ({
      fieldId,
      optionsId,
      moveToId,
    }: {
      fieldId: string;
      optionsId: string;
      moveToId?: string | null;
    }) =>
      databaseApi.deleteFieldOption({
        projectId,
        databaseId,
        fieldId,
        optionsId,
        moveToId,
      }),
    onMutate: async ({ fieldId, optionsId, moveToId }) => {
      await queryClient.cancelQueries({
        queryKey: databaseApi.getById({ id: databaseId, projectId }).queryKey,
      });

      const previousData = queryClient.getQueryData(
        databaseApi.getById({ id: databaseId, projectId }).queryKey,
      );

      queryClient.setQueryData(
        databaseApi.getById({ id: databaseId, projectId }).queryKey,
        (database) => {
          return database
            ? {
                ...database,
                fields: database.fields.map((field) =>
                  field.id === fieldId
                    ? {
                        ...field,
                        config: {
                          ...field.config,
                          options: field.config.options.filter(
                            (option) => option.id !== optionsId,
                          ),
                        },
                      }
                    : field,
                ),
              }
            : database;
        },
      );

      return { previousData };
    },
    onError: (_, __, context) => {
      if (!context) return;
      queryClient.setQueryData(
        databaseApi.getById({ id: databaseId, projectId }).queryKey,
        context.previousData,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: databaseApi.getById({ id: databaseId, projectId }).queryKey,
      });
    },
  });

  return {
    onDeleteFieldOption: mutate,
    onDeleteFieldOptionPending: isPending,
  };
};
