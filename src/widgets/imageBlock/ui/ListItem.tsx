"use client";

import { useState } from "react";
import { FaRegImage } from "react-icons/fa";
import { useOutsideClick } from "@/shared/hooks/useOutsideClick";
import { Card } from "./Card";
import { UploadPanel } from "./UploadPanel";

interface IListItemProps {
  id: string;
  url?: string | null;
  alt?: string | null;
  index: number;
  selectedId: string | null;
  open: (id: string) => void;
  nodeKey: string;
}

export const ListItem = ({
  id,
  url,
  index,
  alt,
  selectedId,
  nodeKey,
  open,
}: IListItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useOutsideClick<HTMLLIElement>(() => setIsOpen(false));

  return (
    <li
      ref={ref}
      key={id}
      className="relative grid"
      style={{
        gridArea: index < 4 ? `image${index + 1}` : "",
      }}
    >
      {url ? (
        <Card
          selectedId={selectedId}
          nodeKey={nodeKey}
          open={() => open(id)}
          id={id}
          url={url}
          alt={alt ?? "image"}
        />
      ) : (
        <UploadPanel
          nodeKey={nodeKey}
          trigger={
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="relative cursor-pointer text-xl text-text font-bold flex gap-1 items-center justify-center w-full h-full rounded-2xl transition-[background] duration-250 hover:bg-bg-hover "
              style={{ background: isOpen ? "var(--bg-hover)" : "" }}
            >
              <span>
                <FaRegImage size={25} />
              </span>
              Добавить изображение
            </button>
          }
          id={id}
        />
      )}
    </li>
  );
};
