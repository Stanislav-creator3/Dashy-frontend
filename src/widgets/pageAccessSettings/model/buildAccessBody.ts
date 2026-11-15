import {
  ACCESS_LEVEL,
  IUpdatePageAccess,
} from "@/entities/pages/model/page.types";
import { ResolvedAccess } from "./resolvePageAccess";

// Тело PUT при смене уровня одной роли. PUT заменяет доступ целиком, поэтому
// берём действующие права страницы (свои или унаследованные) и меняем одну роль.
// Если страница наследовала доступ, она получает свой с теми же правами
export function buildAccessBody({
  resolved,
  roleId,
  level,
}: {
  resolved: ResolvedAccess;
  roleId: string;
  level: ACCESS_LEVEL;
}): IUpdatePageAccess {
  const levels = new Map(resolved.levels);

  // NONE на сервер не уходит: у роли просто нет строки
  if (level === ACCESS_LEVEL.NONE) levels.delete(roleId);
  else levels.set(roleId, level);

  return {
    inheritAccess: false,
    access: [...levels].map(([id, value]) => ({ roleId: id, level: value })),
  };
}

// Тело PUT для чекбокса «Наследовать доступ от родителя».
// Включение наследования строки не удаляет (бэк их хранит), поэтому настройки
// не теряются. При выключении возвращаются прежние строки страницы, а если
// своих ещё не было, она начинает с копии действующих прав
export function buildInheritBody({
  inherit,
  hasStoredAccess,
  resolved,
}: {
  inherit: boolean;
  hasStoredAccess: boolean;
  resolved: ResolvedAccess;
}): IUpdatePageAccess {
  if (inherit) return { inheritAccess: true };
  if (hasStoredAccess) return { inheritAccess: false };

  return {
    inheritAccess: false,
    access: [...resolved.levels].map(([roleId, level]) => ({ roleId, level })),
  };
}
