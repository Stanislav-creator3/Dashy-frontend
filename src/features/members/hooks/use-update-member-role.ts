"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { projectsApi } from "@/entities/projects/api/projects.api";

export function useUpdateMemberRole({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      projectsApi.updateMemberRole({ projectId, userId, roleId }),
    onError: (error) => {
      toast.error(error.message, { position: "bottom-right" });
    },
    onSettled: () => {
      queryClient.invalidateQueries(projectsApi.getProject(projectId));
    },
  });

  return {
    updateMemberRole: mutate,
    updateMemberRoleAsync: mutateAsync,
    isPending,
  };
}
