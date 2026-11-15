import { PROJECT_ROLE_TYPE } from "@/entities/roles/model/role.types";

type RoleType = PROJECT_ROLE_TYPE | undefined | null;

// Правила повторяют Dashy-Backend/src/modules/projects/projects.service.ts

export const isOwnerOrAdmin = (role: RoleType) =>
  role === PROJECT_ROLE_TYPE.OWNER || role === PROJECT_ROLE_TYPE.ADMIN;

// Владелец один, роль владельца выдать нельзя. Роль админа выдаёт только владелец
export function canAssignRole(actor: RoleType, role: RoleType) {
  if (!isOwnerOrAdmin(actor)) return false;
  if (role === PROJECT_ROLE_TYPE.OWNER) return false;
  if (role === PROJECT_ROLE_TYPE.ADMIN)
    return actor === PROJECT_ROLE_TYPE.OWNER;
  return true;
}

// Можно ли вообще менять роль участника: владельца менять нельзя,
// админ не трогает других админов
export function canChangeMemberRole(actor: RoleType, target: RoleType) {
  if (!isOwnerOrAdmin(actor)) return false;
  if (target === PROJECT_ROLE_TYPE.OWNER) return false;
  if (actor === PROJECT_ROLE_TYPE.ADMIN) {
    return target !== PROJECT_ROLE_TYPE.ADMIN;
  }
  return true;
}

// Владельца удалить нельзя. Любой участник может выйти сам,
// владелец удаляет любого, админ — всех, кроме владельца и админов
export function canRemoveMember({
  actor,
  target,
  isSelf,
}: {
  actor: RoleType;
  target: RoleType;
  isSelf: boolean;
}) {
  if (!actor || !target) return false;
  if (target === PROJECT_ROLE_TYPE.OWNER) return false;
  if (isSelf) return true;
  if (actor === PROJECT_ROLE_TYPE.OWNER) return true;
  return actor === PROJECT_ROLE_TYPE.ADMIN && !isOwnerOrAdmin(target);
}
