"use client";

import { AnimatePresence, motion } from "motion/react";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { useSideBar } from "../hooks/useSidebar";
import { useResolvedTheme } from "@/widgets/themeProvider/model/store";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "@/entities/projects/api/projects.api";
import { getIcon } from "@/shared/utils/getIcon";
import { renderIcon } from "@/shared/utils/renderIcon";

export function SidebarProjectButton({ isActive }: { isActive: boolean }) {
  const { id: projectId } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery(projectsApi.getProject(projectId));
  const { isOpen, close, open } = useSideBar();
  const theme = useResolvedTheme();

 
  const toggleSidebar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOpen) {
      close();
    } else {
      open();
    }
  };

  const icon = data?.icon ? getIcon(data?.icon) : null;
  return (
    <motion.div
      initial={{ background: "rgba(255,255,255,0)" }}
      whileHover={{
        background: "rgba(255,255,255,05)",
        color: "var(--color-black)",
      }}
      animate={{
        background: isActive ? "rgba(255,255,255,05)" : "rgba(255,255,255,0)",
      }}
      className={
        "flex justify-between items-center w-full p-2 cursor-pointer rounded-4xl"
      }
    >
      {isLoading ? (
        <div className="flex gap-2">
          <div className="w-10 h-10 rounded-lg animate-pulse bg-gray" />
          <div className="w-20 h-10 rounded-lg animate-pulse bg-gray" />
        </div>
      ) : (
        <p className="flex gap-2 items-center">
          {icon && <span>{renderIcon(icon)}</span>}
          {data?.name}
        </p>
      )}
      <motion.div
        onClick={(e) => toggleSidebar(e)}
        className={"cursor-pointer"}
      >
        <AnimatePresence initial={false} mode="wait">
          {isOpen ? (
            <motion.div
              key="open"
              whileHover={{
                background: "var(--color-bg-hover)",
                color:
                  theme === "dark"
                    ? "var(--color-white)"
                    : "var(--color-black)",
              }}
              className={
                "flex p-1 rounded-sm items-center align-middle gap-3 text-xl cursor-pointer"
              }
              initial={{
                opacity: 0,
                x: -8,
                background: "rgba(255,255,255,0)",
              }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              <GoSidebarExpand size={20} />
            </motion.div>
          ) : (
            <motion.button
              key="close"
              className="flex p-1 items-center rounded-sm justify-center cursor-pointer"
              initial={{
                opacity: 0,
                x: -8,
                background: "rgba(255,255,255,0)",
              }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              whileHover={{
                background: "var(--color-bg-hover)",
                color:
                  theme === "dark"
                    ? "var(--color-white)"
                    : "var(--color-black)",
              }}
              transition={{ duration: 0.2 }}
            >
              <GoSidebarCollapse size={20} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
