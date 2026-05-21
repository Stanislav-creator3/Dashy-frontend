import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pagesApi } from "../api/pages.api";

export function useUploadCover({
  pageId,
  projectId,
}: {
  pageId: string;
  projectId: string;
}) {
  const queryClient = useQueryClient();
  const { mutate: uploadCover, isPending } = useMutation({
    mutationFn: pagesApi.changeCover,
    onSettled: () => {
      queryClient.invalidateQueries(
        pagesApi.getByIdPage({
          id: pageId,
          projectId,
        }),
      );
    },
  });

  return { uploadCover, isPending };
}
