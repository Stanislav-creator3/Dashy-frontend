"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { rolesApi } from "@/entities/roles/api/roles.api";
import { KEYS_API } from "@/shared/config/api";

export function useDeleteRole({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: (roleId: string) => rolesApi.deleteRole({ projectId, roleId }),
    onSuccess: () => {
      toast.success("Роль удалена", { position: "bottom-right" });
    },
    onError: (error) => {
      toast.error(error.message, { position: "bottom-right" });
    },
    onSettled: () => {
      queryClient.invalidateQueries(rolesApi.getRoles({ projectId }));
      queryClient.invalidateQueries({
        queryKey: [KEYS_API.PAGE_ACCESS, projectId],
      });
    },
  });

  return { deleteRole: mutate, deleteRoleAsync: mutateAsync, isPending };
}
