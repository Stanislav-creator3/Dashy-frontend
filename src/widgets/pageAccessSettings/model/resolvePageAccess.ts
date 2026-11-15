import {
  ACCESS_LEVEL,
  IPageAccessSummary,
} from "@/entities/pages/model/page.types";

export interface PageNode {
  id: string;
  title: string;
  parentId: string | null;
}

export type AccessMode = "own" | "inherit" | "private";

export interface ResolvedAccess {
  mode: AccessMode;
  // Страница, чьи права действуют. Нет у закрытой страницы
  source: PageNode | null;
  // Уровень по id роли. Роли без записи — без доступа
  levels: Map<string, ACCESS_LEVEL>;
}

// Повторяет расчёт бэка: идём от страницы вверх до первой с inheritAccess = false
export function resolvePageAccess({
  pageId,
  pagesById,
  accessById,
}: {
  pageId: string;
  pagesById: Map<string, PageNode>;
  accessById: Map<string, IPageAccessSummary>;
}): ResolvedAccess {
  const page = pagesById.get(pageId);
  const toLevels = (access: IPageAccessSummary) =>
    new Map(access.access.map((item) => [item.role.id, item.level]));

  const own = accessById.get(pageId);
  if (page && own && !own.inheritAccess) {
    return { mode: "own", source: page, levels: toLevels(own) };
  }

  let current = page?.parentId ? pagesById.get(page.parentId) : undefined;
  while (current) {
    const access = accessById.get(current.id);
    if (access && !access.inheritAccess) {
      return { mode: "inherit", source: current, levels: toLevels(access) };
    }
    current = current.parentId ? pagesById.get(current.parentId) : undefined;
  }

  return { mode: "private", source: null, levels: new Map() };
}
