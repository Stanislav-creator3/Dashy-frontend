"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { projectsApi } from "@/entities/projects/api/projects.api";
import { IAddMember } from "@/entities/projects/model/project.types";
import { KEYS_API } from "@/shared/config/api";

export function useAddMember({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: (data: IAddMember) =>
      projectsApi.addMember({ projectId, data }),
    onSuccess: () => {
      toast.success("Участник добавлен", { position: "bottom-right" });
    },
    onSettled: () => {
      queryClient.invalidateQueries(projectsApi.getProject(projectId));
    },
  });

  return { addMember: mutate, addMemberAsync: mutateAsync, isPending };
}
