"use client";

import { motion } from "motion/react";
import { useSideBar } from "../hooks/useSidebar";
import { useParams, usePathname } from "next/navigation";
import { match } from "path-to-regexp";
import { cn } from "@/shared/utils/utils";
import SidebarHeader from "./SidebarHeader";
import MainNav from "./MainNav";
import SettingsNav from "./SettingsNav";

export default function Sidebar({
  className,
  variants = "main",
}: {
  className?: string;
  variants?: "main" | "settings";
}) {
  const { id: projectId } = useParams<{ id: string }>();
  const { isOpen } = useSideBar();
  const pathname = usePathname();
  const isActive = !!match(`/projects/${projectId}`)(pathname);

  const isSettingsPage = variants === "settings";

  return (
    <motion.div
      className={cn(
        className,
        "flex flex-col justify-center items-center h-full",
      )}
    >
      <motion.div
        className={cn("glass-card flex-1 py-4 px-2 scrollbar h-full w-full")}
        animate={{ height: isSettingsPage ? "100%" : isOpen ? "90vh" : "65vh" }}
      >
        {!isSettingsPage && (
          <SidebarHeader projectId={projectId} isActive={isActive} />
        )}
        {isSettingsPage ? (
          <SettingsNav projectId={projectId} />
        ) : (
          <MainNav isOpen={isOpen} projectId={projectId} />
        )}
      </motion.div>
    </motion.div>
  );
}
