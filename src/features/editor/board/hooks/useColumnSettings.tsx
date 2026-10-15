import { BOARD_COLORS, BoardColorId } from "../model/boardColors";
import { ColorBoard } from "../ui/ColorBoard";
import { CgColorBucket } from "react-icons/cg";
import { FaRegTrashAlt } from "react-icons/fa";

export function useColumnSetting({
  columnId,
  color,
  onColorChange,
  onDelete,
}: {
  columnId: string;
  color: BoardColorId;
  onColorChange: (colorId: BoardColorId) => void;
  onDelete: () => void;
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
      children: BOARD_COLORS.map((item) => ({
        id: item.id,
        label: (
          <ColorBoard
            color={color}
            id={item.id}
            background={item.background}
            label={item.label}
          />
        ),
        onClick: () => onColorChange(item.id),
      })),
    },
    {
      id: "deleteColumn",
      label: (
        <p className="flex gap-1 items-center">
          <span>
            <FaRegTrashAlt size={20} />
          </span>
          Удалить
        </p>
      ),
      color: "var(--color-bg-error)",
      onClick: () => onDelete(),
    },
  ];

  return items;
}
