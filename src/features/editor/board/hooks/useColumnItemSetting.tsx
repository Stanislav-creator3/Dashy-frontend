import {
  DATABASE_COLORS,
  DatabaseColorId,
} from "@/entities/database/model/databaseColors";
import { ColorBoard } from "../ui/ColorBoard";
import { CgColorBucket } from "react-icons/cg";
import { FaRegTrashAlt } from "react-icons/fa";

export function useColumnItemSetting({
  id,
  color,
  onColorChange,
  onDelete,
}: {
  id: string;
  color: DatabaseColorId;
  onColorChange: ({
    id,
    color,
  }: {
    id: string;
    color: DatabaseColorId;
  }) => void;
  onDelete?: (columnId: string) => void;
}) {
  const items = [
    {
      id: "colorColumn",
      label: (
        <p className="flex gap-1 items-center">
          <span>
            <CgColorBucket size={20} />
          </span>
          Цвет
        </p>
      ),
      children: DATABASE_COLORS.map((item) => ({
        id: item.id,
        label: (
          <ColorBoard
            color={color}
            id={item.id}
            background={item.background}
            label={item.label}
          />
        ),
        onClick: () => onColorChange({ id, color: item.id }),
      })),
    },
    {
      id: "deletePage",
      label: (
        <p className="flex gap-1 items-center">
          <span>
            <FaRegTrashAlt size={20} />
          </span>
          Удалить
        </p>
      ),
      color: "var(--color-bg-error)",
      onClick: () => onDelete?.(id),
    },
  ];

  return items;
}
