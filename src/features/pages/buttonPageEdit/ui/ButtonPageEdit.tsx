"use client";

import { ButtonEdit, DropdownMenu } from "@/shared/ui";
import { AnimatePresence } from "motion/react";
import { useMenuEditItems } from "../hooks/useMenuEditItems";

export default function ButtonPageEdit({
  isHover = false,
  pageId,
  projectId,
  parentId,
  setIsEdit,
}: {
  isHover?: boolean;
  pageId: string;
  projectId: string;
  parentId: string | null;
  setIsEdit: (value: boolean) => void;
}) {
  const itemMenu = useMenuEditItems(pageId, parentId, projectId, setIsEdit);

  return (
    <AnimatePresence>
      <DropdownMenu items={itemMenu}>
        {isHover && <ButtonEdit />}
      </DropdownMenu>
    </AnimatePresence>
  );
}
