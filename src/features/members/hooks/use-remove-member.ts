"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { projectsApi } from "@/entities/projects/api/projects.api";
import { KEYS_API } from "@/shared/config/api";

export function useRemoveMember({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: (userId: string) =>
      projectsApi.removeMember({ projectId, userId }),
    onSuccess: () => {
      toast.success("Участник удалён", { position: "bottom-right" });
    },
    onError: (error) => {
      toast.error(error.message, { position: "bottom-right" });
    },
    onSettled: () => {
      queryClient.invalidateQueries(projectsApi.getProject(projectId));
    },
  });

  return { removeMember: mutate, removeMemberAsync: mutateAsync, isPending };
}
