import { cn } from "@/shared/utils/utils";

interface IProps {
  items: string[];
  onClick: (color: string) => void;
  className?: string;
}

export default function ColorListText({ items, onClick, className }: IProps) {
  return (
    <div
      className={cn("grid grid-cols-[repeat(auto-fill,35px)] gap-1", className)}
    >
      {items.map((item) => (
        <button
          type="button"
          key={item}
          onClick={() => onClick(item)}
          className={
            "flex items-center justify-center p-1 w-6.5 h-6.5 cursor-pointer border-4 rounded-md transition-[border] duration-300 hover:border"
          }
          style={{
            color: item,
            borderColor: item,
          }}
        >
          A
        </button>
      ))}
    </div>
  );
}
