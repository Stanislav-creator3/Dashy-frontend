import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pagesApi } from "../api/pages.api";

export function useDeleteCover({
  pageId,
  projectId,
}: {
  pageId: string;
  projectId: string;
}) {
  const queryClient = useQueryClient();
  const { mutate: deleteCover, isPending } = useMutation({
    mutationFn: () => pagesApi.deleteCover({ pageId, projectId }),
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
          if (!data || !data.cover) return;
          return {
            ...data,
            cover: null,
          };
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

  return { deleteCover, isPending };
}
