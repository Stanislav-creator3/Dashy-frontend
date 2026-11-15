"use client";

import { useProjectRole } from "@/entities/projects/hooks/use-project-role";
import { projectsApi } from "@/entities/projects/api/projects.api";
import { IProjectMember } from "@/entities/projects/model/project.types";
import { rolesApi } from "@/entities/roles/api/roles.api";
import { PROJECT_ROLE_TYPE } from "@/entities/roles/model/role.types";
import {
  canChangeMemberRole,
  canRemoveMember,
  MemberRoleSelect,
  RemoveMemberButton,
} from "@/features/members";
import UserAvatar from "@/shared/ui/userAvatar/UserAvatar";
import { useQuery } from "@tanstack/react-query";

const getName = (member: IProjectMember) =>
  member.user.username ?? member.user.email;

// Владелец, админы, остальные; внутри групп по имени
const getGroup = (member: IProjectMember) => {
  if (member.role.type === PROJECT_ROLE_TYPE.OWNER) return 0;
  if (member.role.type === PROJECT_ROLE_TYPE.ADMIN) return 1;
  return 2;
};

const sortMembers = (members: IProjectMember[]) =>
  [...members].sort(
    (a, b) =>
      getGroup(a) - getGroup(b) || getName(a).localeCompare(getName(b), "ru"),
  );

export default function MembersTab({ projectId }: { projectId: string }) {
  const {
    data: project,
    isLoading,
    error,
  } = useQuery(projectsApi.getProject(projectId));
  const {
    role: actorRole,
    userId,
    isOwnerOrAdmin,
    isLoading: isLoadingRole,
  } = useProjectRole(projectId);
  const { data: roles } = useQuery({
    ...rolesApi.getRoles({ projectId }),
    enabled: isOwnerOrAdmin,
  });

  if (isLoading) return <p className="text-gray p-2">Загрузка...</p>;
  if (error) return <p className="text-red-500 p-2">{error.message}</p>;

  return (
    <ul className="flex flex-col pt-3">
      {sortMembers(project?.members ?? []).map((member) => {
        const name = getName(member);
        const isSelf = member.userId === userId;

        const canChangeRole =
          !isLoadingRole &&
          !!roles &&
          !isSelf &&
          canChangeMemberRole(actorRole?.type, member.role.type);
        // Выход из проекта живёт в SettingsNav, у себя корзины нет
        const canRemove =
          !isLoadingRole &&
          !isSelf &&
          canRemoveMember({
            actor: actorRole?.type,
            target: member.role.type,
            isSelf,
          });

        return (
          <li
            key={member.id}
            className="flex items-center justify-between gap-3 py-3 border-b border-border"
          >
            <div className="flex items-center gap-3">
              <UserAvatar
                avatar={member.user?.avatar}
                userName={name}
                alt={name}
              />
              <div className="flex flex-col leading-4">
                <p className="text-text font-bold">
                  {name}
                  {isSelf && (
                    <span className="ml-2 text-sm font-normal text-gray">
                      Вы
                    </span>
                  )}
                </p>
                <p className="text-gray-500">{member.user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {canChangeRole ? (
                <MemberRoleSelect
                  projectId={projectId}
                  member={member}
                  roles={roles}
                  actorRole={actorRole?.type}
                />
              ) : (
                <p className="text-sm text-gray">{member.role.name}</p>
              )}
              {canRemove && (
                <RemoveMemberButton projectId={projectId} member={member} />
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
