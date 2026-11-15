"use client";

import { IProjectMember } from "@/entities/projects/model/project.types";
import RoleSelect from "@/entities/roles/ui/RoleSelect";
import { IRole, PROJECT_ROLE_TYPE } from "@/entities/roles/model/role.types";
import { useUpdateMemberRole } from "../hooks/use-update-member-role";
import { canAssignRole } from "../model/memberPermissions";

export default function MemberRoleSelect({
  projectId,
  member,
  roles,
  actorRole,
}: {
  projectId: string;
  member: IProjectMember;
  roles: IRole[];
  actorRole: PROJECT_ROLE_TYPE | undefined | null;
}) {
  const { updateMemberRole, isPending } = useUpdateMemberRole({ projectId });

  // Текущая роль остаётся в списке, чтобы кнопка не теряла подпись
  const availableRoles = roles.filter(
    (role) => role.id === member.roleId || canAssignRole(actorRole, role.type),
  );

  return (
    <RoleSelect
      roles={availableRoles}
      value={member.roleId}
      disabled={isPending}
      onChange={(roleId) => updateMemberRole({ userId: member.userId, roleId })}
    />
  );
}
