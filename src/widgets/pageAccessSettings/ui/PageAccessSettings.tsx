"use client";

import { pagesApi } from "@/entities/pages/api/pages.api";
import { IPageList } from "@/entities/pages/model/page.types";
import { rolesApi } from "@/entities/roles/api/roles.api";
import { PROJECT_ROLE_TYPE } from "@/entities/roles/model/role.types";
import { Heading, Separator } from "@/shared/ui";
import { flattenTree } from "@/shared/utils/flattenTree";
import { useQuery } from "@tanstack/react-query";
import { Fragment, ReactNode, useMemo, useState } from "react";
import { LuFileText } from "react-icons/lu";
import { PageNode, resolvePageAccess } from "../model/resolvePageAccess";
import PageAccessRow from "./PageAccessRow";

// Глубина и ширина строк-скелетонов, как в макете
const SKELETONS = [
  [0, 140],
  [1, 96],
  [2, 120],
  [2, 104],
  [1, 128],
  [0, 88],
  [0, 112],
];

const ROLE_ORDER = {
  [PROJECT_ROLE_TYPE.OWNER]: 0,
  [PROJECT_ROLE_TYPE.ADMIN]: 1,
  [PROJECT_ROLE_TYPE.MEMBER]: 2,
  [PROJECT_ROLE_TYPE.VIEWER]: 2,
  [PROJECT_ROLE_TYPE.CUSTOM]: 2,
};

export default function PageAccessSettings({
  projectId,
  initialOpenId = null,
}: {
  projectId: string;
  initialOpenId?: string | null;
}) {
  const [openId, setOpenId] = useState<string | null>(initialOpenId);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const tree = useQuery(pagesApi.getPageList({ projectId, parentId: null }));
  const access = useQuery(pagesApi.getProjectAccess({ projectId }));
  const roles = useQuery(rolesApi.getRoles({ projectId }));

  const pagesById = useMemo(
    () =>
      new Map<string, PageNode>(
        flattenTree(tree.data ?? []).map(({ id, title, parentId }) => [
          id,
          { id, title, parentId },
        ]),
      ),
    [tree.data],
  );
  const accessById = useMemo(
    () => new Map((access.data ?? []).map((item) => [item.id, item])),
    [access.data],
  );
  const sortedRoles = useMemo(
    () =>
      [...(roles.data ?? [])].sort(
        (a, b) => ROLE_ORDER[a.type] - ROLE_ORDER[b.type],
      ),
    [roles.data],
  );

  const isLoading = tree.isLoading || access.isLoading || roles.isLoading;
  const error = tree.error ?? access.error ?? roles.error;
  const isEmpty = !isLoading && !error && !tree.data?.length;
  const openParentId = openId ? pagesById.get(openId)?.parentId : null;

  const toggleCollapse = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  const renderNodes = (nodes: IPageList[], depth: number): ReactNode =>
    nodes.map((node) => (
      <Fragment key={node.id}>
        <PageAccessRow
          projectId={projectId}
          node={node}
          depth={depth}
          parent={
            node.parentId
              ? (pagesById.get(node.parentId) ?? undefined)
              : undefined
          }
          isOpen={node.id === openId}
          isParent={node.id === openParentId}
          isCollapsed={collapsed.has(node.id)}
          roles={sortedRoles}
          resolved={resolvePageAccess({
            pageId: node.id,
            pagesById,
            accessById,
          })}
          ownAccess={accessById.get(node.id)}
          onToggleOpen={() =>
            setOpenId((prev) => (prev === node.id ? null : node.id))
          }
          onToggleCollapse={() => toggleCollapse(node.id)}
        />
        {node.children.length > 0 &&
          !collapsed.has(node.id) &&
          renderNodes(node.children, depth + 1)}
      </Fragment>
    ));

  return (
    <div className="flex w-full flex-col">
      <Heading
        title="Страницы"
        description="Доступ ролей к страницам рабочего пространства"
      />
      <p className="mt-2.5 max-w-150 text-pretty leading-relaxed text-gray">
        Здесь видно, какие роли имеют доступ к каждой странице. Владелец и
        администраторы всегда имеют полный доступ. Если у страницы включено
        наследование, она берёт доступ от родительской страницы.
      </p>
      <Separator className="mt-7 mb-4" />

      {isLoading && (
        <div className="flex flex-col gap-0.5" aria-busy="true">
          {SKELETONS.map(([depth, width], index) => (
            <div
              key={index}
              className="flex h-10 animate-pulse items-center gap-2.5"
              style={{ paddingLeft: depth * 16 + 8 }}
            >
              <div className="h-4.5 w-4.5 rounded-md bg-bg-hover" />
              <div
                className="h-2.5 rounded-full bg-bg-hover"
                style={{ width }}
              />
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-500">{error.message}</p>}

      {isEmpty && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-6 py-10 text-center">
          <LuFileText size={28} className="text-gray" />
          <p className="mt-1 font-medium">В проекте пока нет страниц</p>
          <p className="text-gray">
            Когда появятся страницы, здесь будет видно, у каких ролей есть к ним
            доступ.
          </p>
        </div>
      )}

      {!isLoading && !error && !isEmpty && (
        <div className="flex flex-col gap-0.5">
          {renderNodes(tree.data ?? [], 0)}
        </div>
      )}
    </div>
  );
}
