"use client";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { SidebarItemSkeleton } from "./SidebarItemSkeleton";
import { ButtonNewPage } from "@/features/pages/buttonNewPage";
import { SidebarTreeItem } from "./SidebarTreeItem";
import { getIcon } from "@/shared/utils/getIcon";
import { match } from "path-to-regexp";
import { useGetPageList } from "@/entities/pages/hooks/use-get-page-list";
import { usePathname } from "next/navigation";
import { DragDropProvider, useDraggable, useDroppable } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BASE_API_URL, KEYS_API } from "@/shared/config/api";
import { IPageList } from "@/entities/pages/model/page.types";
import { SidebarTree } from "./SidebarTree";
import { useReorderPages } from "@/entities/pages/hooks/use-reorder-pages";

export default function MainNav({
  isOpen,
  projectId,
}: {
  isOpen: boolean;
  projectId: string;
}) {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const { data, isLoading } = useGetPageList({ projectId, parentId: null });
  const { mutate: reorderPages } = useReorderPages({ projectId }); // ← добавить

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          className="flex flex-col gap-4"
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <SidebarItemSkeleton key={index} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          key="list"
          layout="position"
          className="flex flex-col gap-1 scrollbar sidebar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            height: isOpen ? "50vh" : "25vh",
          }}
        >
          <ButtonNewPage projectId={projectId} />
          <SidebarTree
            items={data || []}
            pathname={pathname}
            projectId={projectId}
            onChange={reorderPages}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
