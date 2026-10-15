import { databaseApi } from "@/entities/database/api/database.api";
import { IDatabaseFieldConfig } from "@/entities/database/model/database.type";
import { DatabaseColorId } from "@/entities/database/model/databaseColors";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdataColumn = ({
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
      data,
    }: {
      fieldId: string;
      data: {
        name?: string;
        position?: number;
        config?: IDatabaseFieldConfig;
      };
    }) =>
      databaseApi.updateField({
        projectId,
        databaseId,
        fieldId,
        data,
      }),
    onMutate: async ({ fieldId, data }) => {
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
                  field.id === fieldId ? { ...field, ...data } : field,
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

  return { updataColumn: mutate, isPending };
};
