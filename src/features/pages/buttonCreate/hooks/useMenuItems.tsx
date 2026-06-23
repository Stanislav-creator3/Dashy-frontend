"use client";

import { TiDocumentAdd } from "react-icons/ti";
import { BsKanban } from "react-icons/bs";
import toast from "react-hot-toast";
import { PAGE_TYPE } from "@/entities/pages/model/page.types";
import { useCreatePage } from "@/entities/pages/hooks/use-create-page";

export const useMenuItems = ({
  projectId,
  parentId,
}: {
  projectId: string;
  parentId: string;
}) => {
  const { mutate } = useCreatePage({ projectId, parentId });

  const onCreatePage = (type: PAGE_TYPE) => {
    if (!projectId) {
      toast.error("Проект не найден");
      return;
    }
    mutate({
      projectId,
      data: { parentId, type },
    });
  };

  const itemMenu = [
    {
      onClick: () => onCreatePage(PAGE_TYPE.PAGE),
      label: (
        <p className="flex gap-1 items-center justify-center">
          <span>
            <TiDocumentAdd size={20} />
          </span>
          Новый страница
        </p>
      ),
    },
    {
      onClick: () => alert("test"),
      label: (
        <p className="flex gap-1 items-center justify-center">
          <span>
            <BsKanban size={20} />
          </span>
          Новая доска
        </p>
      ),
    },
  ];

  return itemMenu;
};
