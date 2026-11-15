"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { rolesApi } from "@/entities/roles/api/roles.api";

export function useCreateRole({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: (name: string) =>
      rolesApi.createRole({ projectId, data: { name } }),
    onSuccess: () => {
      toast.success("Роль создана", { position: "bottom-right" });
    },
    onError: (error) => {
      toast.error(error.message, { position: "bottom-right" });
    },
    onSettled: () => {
      queryClient.invalidateQueries(rolesApi.getRoles({ projectId }));
    },
  });

  return { createRole: mutate, createRoleAsync: mutateAsync, isPending };
}
