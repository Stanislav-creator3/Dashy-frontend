import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IPageList } from "../model/page.types";
import { pagesApi } from "../api/pages.api";

function flattenWithPositions(
  items: IPageList[],
  parentId: string | null,
): { id: string; parentId: string | null; position: number }[] {
  return items.flatMap((item, index) => [
    { id: item.id, parentId, position: index },
    ...flattenWithPositions(item.children, item.id),
  ]);
}

export function useReorderPages({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newTree: IPageList[]) => {
      const flat = flattenWithPositions(newTree, null);
      const pages = flat.map((item, index) => ({
        id: item.id,
        parentId: item.parentId,
        position: index,
      }));
      return pagesApi.reorderPages({ projectId, pages });
    },

    onMutate: async (newTree) => {
      await queryClient.cancelQueries({
        queryKey: pagesApi.getPageList({ projectId }).queryKey,
      });

      const previousData = queryClient.getQueryData<IPageList[]>(
        pagesApi.getPageList({ projectId }).queryKey,
      );

      queryClient.setQueryData(
        pagesApi.getPageList({ projectId }).queryKey,
        newTree,
      );

      return { previousData };
    },

    onError: (_err, _newTree, context) => {
      queryClient.setQueryData(
        pagesApi.getPageList({ projectId }).queryKey,
        context?.previousData,
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries(pagesApi.getPageList({ projectId }));
    },
  });
}
