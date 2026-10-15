"use client";

import { ButtonEdit, DropdownMenu } from "@/shared/ui";
import { AnimatePresence } from "motion/react";
import { useMenuEditItems } from "../hooks/useMenuEditItems";
import { useState } from "react";

export default function ButtonPageEdit({
  isHover = false,
  isMenuOpen = false,
  pageId,
  projectId,
  parentId,
  setIsEdit,
  onOpenChange,
}: {
  isHover?: boolean;
  isMenuOpen?: boolean;
  pageId: string;
  projectId: string;
  parentId: string | null;
  setIsEdit: (value: boolean) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const itemMenu = useMenuEditItems(pageId, parentId, projectId, setIsEdit);
  const [open, setOpen] = useState(false);

  return (
    <AnimatePresence>
      <DropdownMenu
        enabledClick={true}
        items={itemMenu}
        onOpenChange={(open) => {
          (onOpenChange(open), setOpen(open));
        }}
        trigger={(isHover || isMenuOpen) && <ButtonEdit isActive={open} />}
      />
    </AnimatePresence>
  );
}
