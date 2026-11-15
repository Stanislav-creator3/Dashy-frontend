"use client";

import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api/projects.api";
import { userApi } from "@/entities/user/api/user.api";
import { PROJECT_ROLE_TYPE } from "@/entities/roles/model/role.types";

export function useProjectRole(projectId: string) {
  const { data: project, isLoading: isLoadingProject } = useQuery(
    projectsApi.getProject(projectId),
  );
  const { data: me, isLoading: isLoadingMe } = useQuery(userApi.getMe());

  const member = project?.members.find((item) => item.userId === me?.id);
  const role = member?.role ?? null;

  const isOwner = role?.type === PROJECT_ROLE_TYPE.OWNER;
  const isAdmin = role?.type === PROJECT_ROLE_TYPE.ADMIN;

  return {
    member,
    role,
    userId: me?.id,
    isOwner,
    isAdmin,
    isOwnerOrAdmin: isOwner || isAdmin,
    isLoading: isLoadingProject || isLoadingMe,
  };
}
