import { pagesApi } from "@/entities/pages/api/pages.api";
import { useUpdatePage } from "@/entities/pages/hooks/use-update-page";
import { getRandomEmoji } from "@/shared/utils/getRandomEmoji";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props {
  pageId: string;
  projectId: string;
  parentId: string | null;
  onOpenPicker?: () => void;
}

export default function useAddIcon({
  pageId,
  projectId,
  parentId,
  onOpenPicker,
}: Props) {
  const queryClient = useQueryClient();
  const { mutate: handleUpdate } = useMutation({
    mutationFn: pagesApi.updatePage,
    onSettled: () => {
      queryClient.invalidateQueries(pagesApi.getByIdPage({
        id: pageId,
        projectId,
      }));
      queryClient.invalidateQueries(pagesApi.getPageList({
        projectId,
        parentId,
      }));
    }
  });

  const addRandomIcon = () => {
    const icon = getRandomEmoji();

    handleUpdate({
      id: pageId,
      projectId,
      body: {
        icon: icon,
      },
    });

    onOpenPicker?.();
  };

  return {
    addRandomIcon,
  };
}
