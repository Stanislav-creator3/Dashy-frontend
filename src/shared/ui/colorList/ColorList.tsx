import { cn } from "@/shared/utils/utils";

interface IProps {
  items: string[];
  onClick: (color: string) => void;
  className?: string;
}

export default function ColorList({ items, onClick, className }: IProps) {
  return (
    <div
      className={cn("grid grid-cols-[repeat(auto-fill,35px)] gap-1", className)}
    >
      <button
        type="button"
        onClick={() => onClick("transparent")}
        className={
          "p-1 w-6.5 h-6.5 cursor-pointer border-2 border-black rounded-md transition-[border] duration-300 hover:border-black"
        }
      />
      {items.map((item) => (
        <button
          type="button"
          key={item}
          onClick={() => onClick(item)}
          className={
            "p-1 w-6.5 h-6.5 cursor-pointer border-1 border-transparent rounded-md transition-[border] duration-300 hover:border-black"
          }
          style={{
            backgroundColor: item,
          }}
        />
      ))}
    </div>
  );
}
