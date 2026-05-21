"use client";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { SidebarItemSkeleton } from "./SidebarItemSkeleton";
import { ButtonNewPage } from "@/features/pages/buttonNewPage";
import { SidebarTreeItem } from "./SidebarTreeItem";
import { getIcon } from "@/shared/utils/getIcon";
import { match } from "path-to-regexp";
import { useGetPageList } from "@/entities/pages/hooks/use-get-page-list";
import { usePathname } from "next/navigation";

export default function MainNav({
  isOpen,
  projectId,
}: {
  isOpen: boolean;
  projectId: string;
}) {
  const pathname = usePathname();
  const { data, isLoading } = useGetPageList({ projectId, parentId: null });

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
          className="flex flex-col gap-1  scrollbar sidebar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            height: isOpen ? "50vh" : "25vh",
          }}
        >
          <ButtonNewPage projectId={projectId} />
          <LayoutGroup>
            <AnimatePresence>
              {data?.map((item) => (
                <motion.div
                  layout
                  transition={{
                    layout: {
                      type: "spring",
                      bounce: 0.25,
                    },
                  }}
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -30 }}
                >
                  <SidebarTreeItem
                    parentId={item.parentId}
                    icon={getIcon(item.icon ?? item.type)}
                    iconColor={item.iconColor}
                    title={item.title}
                    id={item.id}
                    hasChildren={item.children}
                    level={1}
                    isActive={
                      !!match(`/projects/${projectId}/pages/${item.id}`)(
                        pathname,
                      )
                    }
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </LayoutGroup>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
