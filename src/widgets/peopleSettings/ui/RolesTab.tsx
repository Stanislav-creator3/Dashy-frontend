"use client";

import { rolesApi } from "@/entities/roles/api/roles.api";
import { useProjectRole } from "@/entities/projects/hooks/use-project-role";
import { PROJECT_ROLE_TYPE } from "@/entities/roles/model/role.types";
import { DeleteRoleButton, UpdateNameRole } from "@/features/roles";
import { useQuery } from "@tanstack/react-query";

export default function RolesTab({ projectId }: { projectId: string }) {
  const { isOwnerOrAdmin } = useProjectRole(projectId);
  const { data, isLoading, error } = useQuery(rolesApi.getRoles({ projectId }));

  if (isLoading) return <p className="text-gray p-2">Загрузка...</p>;
  if (error) return <p className="text-red-500 p-2">{error.message}</p>;

  const roles = data?.filter((item) => item.type === PROJECT_ROLE_TYPE.CUSTOM);

  return (
    <div className="flex h-full flex-col gap-3">
      {!roles?.length ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-1 text-center">
          <p className="font-bold">Дополнительных ролей нет</p>
          <p className="max-w-sm text-gray">
            В проекте есть только основные роли: владелец, администратор,
            участник и наблюдатель.
            {isOwnerOrAdmin && " Нажмите «Добавить роль», чтобы создать свою."}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col">
          {roles.map((role) => (
            <li
              key={role.id}
              className="flex items-center justify-between gap-3 py-3 border-b border-border"
            >
              {isOwnerOrAdmin ? (
                <UpdateNameRole projectId={projectId} role={role} />
              ) : (
                <p>{role.name}</p>
              )}

              {isOwnerOrAdmin && (
                <DeleteRoleButton projectId={projectId} role={role} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
