import { cn } from "@/shared/utils/utils";
import { IIconList } from "../model/icons";

interface IProps {
  items: IIconList[];
  onClick: (name: IIconList) => void;
  color: string;
  className?: string;
}

export function IconList({ items, onClick, color, className }: IProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-[repeat(auto-fill,35px)] items-center justify-center gap-1",
        className
      )}
    >
      {items.map((item) => (
        <button
          type="button"
          key={item.name}
          onClick={() => onClick(item)}
          className="p-1 cursor-pointer bg-transparent rounded-2xl transition-colors duration-300 hover:bg-[rgba(0,0,0,0.1)] hover:opacity-70"
        >
          <item.icon color={color} size={25} />
        </button>
      ))}
    </div>
  );
}
