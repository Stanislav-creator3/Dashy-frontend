"use client";

import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { SidebarTreeItem } from "./SidebarTreeItem";
import { getIcon } from "@/shared/utils/getIcon";
import { match } from "path-to-regexp";
import { useEffect, useRef, useState } from "react";
import { flattenTree } from "@/shared/utils/flattenTree";
import { move } from "@dnd-kit/helpers";
import { IPageList, PAGE_TYPE } from "@/entities/pages/model/page.types";
import { FlattenedItem } from "../model/types";
import { getDescendants } from "@/shared/utils/getDescendants";
import { getDragDepth } from "@/shared/utils/getDragDepth";
import { getProjection } from "@/shared/utils/getProjection";
import { isKeyboardEvent } from "@dnd-kit/dom/utilities";
import { buildTree } from "@/shared/utils/buildTree";
import { SidebarTreeItemOverlay } from "./SidebarTreeItemOverlay";
import { useSidebarStore } from "../model/store";
import { renderIcon } from "@/shared/utils/renderIcon";
import { getCollapsedIds, getVisible } from "@/shared/utils/utils";
import { UniqueIdentifier } from "@dnd-kit/abstract";
import { INDENTATION } from "../model/constants";

export function SidebarTree({
  items,
  pathname,
  projectId,
  onChange,
}: {
  items: IPageList[];
  pathname: string;
  projectId: string;
  onChange(items: IPageList[]): void;
}) {
  const [flattenedItems, setFlattenedItems] = useState<FlattenedItem[]>(
    flattenTree(items),
  );

  const isOpenItem = useSidebarStore((state) => state.isOpenItem);
  const setIsOpenItem = useSidebarStore((state) => state.setIsOpenItem);

  const activeId = useRef<UniqueIdentifier | null>(null);
  const initialDepth = useRef(0);
  const sourceChildren = useRef<FlattenedItem[]>([]);
  const isDragging = useRef(false);

  const visibleItems = getVisible(
    flattenedItems,
    isOpenItem,
    activeId.current ?? null,
  );

  const parentIds = new Set(flattenedItems.map((item) => item.parentId));

  useEffect(() => {
    if (!isDragging.current) {
      setFlattenedItems(flattenTree(items));
    }
  }, [items]);

  return (
    <DragDropProvider
      onDragStart={(event) => {
        const { source } = event.operation;

        if (!source) return;

        const item = flattenedItems.find((i) => i.id === source.id);
        if (!item) return;

        activeId.current = item.id;
        initialDepth.current = item.depth;
        isDragging.current = true;

        setFlattenedItems((items) => {
          const descendants = getDescendants(items, item.id);
          sourceChildren.current = items.filter((i) => descendants.has(i.id));
          return items.filter((i) => !descendants.has(i.id));
        });
      }}
      onDragOver={(event) => {
        const { source, target } = event.operation;
        event.preventDefault();
        if (!source || !target || source.id === target.id) return;
        setFlattenedItems((items) => {
          const moved = move(getVisible(items, isOpenItem, source.id), event);
          const sourceIdx = moved.findIndex((item) => item.id === source.id);
          const nextId = moved[sourceIdx + 1]?.id;

          const rest = items.filter((item) => item.id !== source.id);
          const sourceItem = items.find((item) => item.id === source.id)!;
          const at = nextId
            ? rest.findIndex((item) => item.id === nextId)
            : rest.length;
          const idx = at === -1 ? rest.length : at;

          return [...rest.slice(0, idx), sourceItem, ...rest.slice(idx)];
        });
      }}
      onDragMove={(event, manager) => {
        if (event.defaultPrevented) return;
        const { source, target } = event.operation;
        if (!source || !target) return;
        const offsetLeft = manager.dragOperation.transform.x;
        const projectedDepth =
          initialDepth.current + getDragDepth(offsetLeft, INDENTATION);
        setFlattenedItems((items) => {
          const visible = getVisible(items, isOpenItem, source.id);
          const collapsedIds = getCollapsedIds(items, isOpenItem);
          const { depth, parentId } = getProjection(
            visible,
            source.id,
            projectedDepth,
            collapsedIds,
          );

          const curDepth = source.data?.depth ?? 0;
          if (curDepth === depth && source.data?.parentId === parentId) {
            return items;
          }

          if (
            isKeyboardEvent(event.operation.activatorEvent) &&
            curDepth !== depth
          ) {
            event.preventDefault();
            manager.actions.move({
              by: { x: INDENTATION * (depth - curDepth), y: 0 },
              propagate: false,
            });
          }

          return items.map((item) =>
            item.id === source.id ? { ...item, depth, parentId } : item,
          );
        });
      }}
      onDragEnd={(event) => {
        const sourceId = activeId.current;
        isDragging.current = false;
        activeId.current = null;

        if (event.canceled) {
          return setFlattenedItems(flattenTree(items));
        }

        const tree = buildTree([...flattenedItems, ...sourceChildren.current]);
        const flat = flattenTree(tree);
        setFlattenedItems(flat);

        let current = flat.find((i) => i.id === sourceId);
        while (current?.parentId) {
          setIsOpenItem(current.parentId, true);
          current = flat.find((i) => i.id === current!.parentId);
        }

        onChange(tree);
      }}
    >
      <LayoutGroup>
        <ul
          key={"list"}
          className="flex flex-col gap-0.5  max-h-[60vh] h-full "
        >
          <AnimatePresence mode="popLayout">
            {visibleItems?.map((item, index) => {
              return (
                <SidebarTreeItem
                  index={index}
                  key={item.id}
                  parentId={item.parentId}
                  icon={getIcon(item.icon ?? item.type)}
                  iconColor={item.iconColor}
                  title={item.title}
                  id={item.id}
                  depth={item.depth}
                  hasChildren={parentIds.has(item.id)}
                  level={1}
                  isActive={
                    !!match(`/projects/${projectId}/pages/${item.id}`)(pathname)
                  }
                />
              );
            })}
          </AnimatePresence>
        </ul>
        <DragOverlay style={{ width: "min-content" }}>
          {(source) => {
            const item = flattenedItems.find((i) => i.id === source.id);
            if (!item) return null;
            return (
              <SidebarTreeItemOverlay
                id={source.id}
                title={item.title}
                iconElement={renderIcon(getIcon(item.icon ?? item.type))}
                count={sourceChildren.current.length}
              />
            );
          }}
        </DragOverlay>
      </LayoutGroup>
    </DragDropProvider>
  );
}
