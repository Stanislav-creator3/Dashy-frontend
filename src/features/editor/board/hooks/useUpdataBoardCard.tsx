import { databaseApi } from "@/entities/database/api/database.api";
import { DatabaseColorId } from "@/entities/database/model/databaseColors";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface IBoardCardUpdate {
  position?: number;
  title?: string;
  cells?: { fieldId: string; value: string | null }[];
  props?: {
    color?: DatabaseColorId;
    icon?: string;
  };
}

export const useUpdateBoardCard = ({
  databaseId,
  projectId,
}: {
  databaseId: string;
  projectId: string;
}) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: ({ rowId, data }: { rowId: string; data: IBoardCardUpdate }) =>
      databaseApi.updateRow({ projectId, databaseId, rowId, data }),

    onMutate: async ({ rowId, data }) => {
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
                rows: database.rows.map((row) =>
                  row.id === rowId ? { ...row, data } : row,
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
    updateCard: mutate,
    isPendingCard: isPending,
  };
};
