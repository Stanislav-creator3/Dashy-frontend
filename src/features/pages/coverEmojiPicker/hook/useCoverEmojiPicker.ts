"use client";

import { useDeleteIcon } from "@/entities/pages/hooks/use-delete-iocn";
import { useUpdatePage } from "@/entities/pages/hooks/use-update-page";
import { useState } from "react";

export default function useCoverEmojiPicker(pageId: string, projectId: string, parentId: string | null) {
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const { handleUpdate } = useUpdatePage({ pageId, projectId });

  const { deleteIcon } = useDeleteIcon({ pageId, projectId, parentId: parentId });

  return {
    openEmojiPicker,
    setOpenEmojiPicker,
    handleUpdate,
    deleteIcon,
  };
}
