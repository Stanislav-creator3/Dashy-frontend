import { databaseApi } from "@/entities/database/api/database.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateDatabase = ({
  databaseId,
  projectId,
}: {
  databaseId: string;
  projectId: string;
}) => {
  const queryClient = useQueryClient();
  const { mutate: updateDatabase, isPending: isLoadingUpdateDatabase } =
    useMutation({
      mutationFn: (data: { name: string }) =>
        databaseApi.updateDatabase({ projectId, databaseId, data }),
      onMutate: (data) => {
        queryClient.cancelQueries({
          queryKey: databaseApi.getById({ id: databaseId, projectId }).queryKey,
        });
        const prevDatabase = queryClient.getQueryData(
          databaseApi.getById({ id: databaseId, projectId }).queryKey,
        );

        queryClient.setQueryData(
          databaseApi.getById({ id: databaseId, projectId }).queryKey,
          (database) => {
            return database
              ? {
                  ...database,
                  name: data.name,
                }
              : database;
          },
        );

        return { prevDatabase };
      },
      onError: (_, __, context) => {
        if (!context) return;
        toast.error("Произошла ошибка", {
          position: "bottom-right",
        });
        queryClient.setQueryData(
          databaseApi.getById({ id: databaseId, projectId }).queryKey,
          context.prevDatabase,
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries(
          databaseApi.getById({ id: databaseId, projectId }),
        );
      },
    });

  return {
    updateDatabase,
    isLoadingUpdateDatabase,
  };
};
