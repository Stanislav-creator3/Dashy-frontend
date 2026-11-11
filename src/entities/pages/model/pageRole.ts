import { PAGE_ROLE } from "./page.types";

const ROLE_RANK: Record<PAGE_ROLE, number> = {
  [PAGE_ROLE.NO_ACCESS]: 0,
  [PAGE_ROLE.VIEWER]: 1,
  [PAGE_ROLE.EDITOR]: 2,
  [PAGE_ROLE.FULL_ACCESS]: 3,
};

export function hasPageRole(
  role: PAGE_ROLE | undefined | null,
  required: PAGE_ROLE,
): boolean {
  if (!role) return false;
  return ROLE_RANK[role] >= ROLE_RANK[required];
}

export const canEditPage = (role: PAGE_ROLE | null) =>
  hasPageRole(role, PAGE_ROLE.EDITOR);
