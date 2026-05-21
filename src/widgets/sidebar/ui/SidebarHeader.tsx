"use client";

import SidebarItem from "./SidebarItem";
import { AiOutlineHome } from "react-icons/ai";
import { TbPencil } from "react-icons/tb";
import { SidebarProjectButton } from "./SidebarProjectButton";
import { Modal, Popover } from "@/shared/ui";
import { LogoutButton } from "@/features/session";
import { useState } from "react";
import { ProjectMenu } from "@/features/projects";
import { CreateProjectForm } from "@/features/projects/create";

export default function SidebarHeader({
  projectId,
  isActive,
}: {
  projectId: string;
  isActive: boolean;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCreateProject, setIsOpenCreateProject] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-[2px] mb-5">
        <Popover
          enabledClick={true}
          open={isOpen}
          setOpen={setIsOpen}
          trigger={<SidebarProjectButton isActive={isOpen} />}
        >
          <ProjectMenu
            onClosePopover={setIsOpen}
            onOpenCreateProject={() => setIsOpenCreateProject(true)}
            actionButton={<LogoutButton />}
          />
        </Popover>
        <SidebarItem
          leading={<AiOutlineHome />}
          href={`/projects/${projectId}`}
          isActive={isActive}
        >
          Домашняя страница
        </SidebarItem>
        <SidebarItem
          leading={<TbPencil />}
          href={`/projects/${projectId}`}
          isActive={isActive}
        >
          Черновик
        </SidebarItem>
      </div>
      <Modal
        isOpen={isOpenCreateProject}
        onClose={() => setIsOpenCreateProject(false)}
      >
        <CreateProjectForm />
      </Modal>
    </>
  );
}
