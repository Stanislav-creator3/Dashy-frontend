"use client";

import { useUpdatePageTitle } from "@/entities/pages/hooks/use-update-page-title";
import { useOutsideClick } from "@/shared/hooks/useOutsideClick";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  IoIosCheckmarkCircleOutline,
  IoIosCloseCircleOutline,
} from "react-icons/io";

export function SidebarPagEdit({
  pageId,
  projectId,
  parentId,
  title,
  isEdit,
  setIsEdit,
}: {
  pageId: string;
  projectId: string;
  parentId: string;
  title: string;
  isEdit: boolean;
  setIsEdit: (value: boolean) => void;
}) {
  const { handleUpdate: updateMutate } = useUpdatePageTitle({
    projectId,
    parentId,
    pageId,
  });
  const [titlePage, setTitlePage] = useState(title);

  const handleUpdateTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitlePage(event.target.value);
  };
  const ref = useOutsideClick(() => setIsEdit(false));
  const refInput = useRef<HTMLInputElement | null>(null);

  const handleUpdate = () => {
    const body = { title: titlePage };
    updateMutate({ id: pageId, projectId, body });
    setIsEdit(false);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === "Enter") {
      event.preventDefault();
      handleUpdate();
    }
  };

  useEffect(() => {
    if (!isEdit) return;
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isEdit, handleKeyDown]);

  return (
    <div
      ref={ref}
      className="flex items-center justify-between bg-black rounded-4xl  min-w-40 text-text text-sm whitespace-nowrap overflow-hidden text-ellipsis gap-2 p-2 cursor-pointer"
    >
      <input
        ref={refInput}
        className="ml-8 max-w-[100px] focus:outline-none"
        autoFocus
        value={titlePage}
        onChange={handleUpdateTitle}
      />
      <div className="flex gap-1">
        <button onClick={handleUpdate}>
          <IoIosCheckmarkCircleOutline
            className="text-green-500 cursor-pointer"
            size={20}
            aria-hidden="true"
          />
        </button>
        <button onClick={() => setIsEdit(false)}>
          <IoIosCloseCircleOutline
            className="text-red-500 cursor-pointer"
            size={20}
            aria-hidden={true}
          />
        </button>
      </div>
    </div>
  );
}
