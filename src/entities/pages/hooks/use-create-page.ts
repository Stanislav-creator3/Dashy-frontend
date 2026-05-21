"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pagesApi } from "../api/pages.api";
import { useSideBarItem } from "@/widgets/sidebar/hooks/useSidebarItem";

export function useCreatePage({
  projectId,
  parentId,
}: {
  projectId: string;
  parentId: string | null;
}) {
  const { open } = useSideBarItem({ id: parentId });
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: pagesApi.createPage,
    onSuccess: () => {
      open();
    },
    onSettled: () => {
      queryClient.invalidateQueries(
        pagesApi.getPageList({
          projectId: projectId,
          parentId: parentId || null,
        }),
      );
    },
  });

  return { mutate, isPending, isSuccess };
}
