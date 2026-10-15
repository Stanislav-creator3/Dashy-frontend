import { AiOutlineCheck } from "react-icons/ai";
import { DatabaseColorId } from "@/entities/database/model/databaseColors";

export function ColorBoard({
  color,
  id,
  background,
  label,
}: {
  color: DatabaseColorId;
  id: DatabaseColorId;
  background: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1  w-full cursor-pointer ">
      <div
        className="w-6 h-6 rounded-full"
        style={{ backgroundColor: background }}
      />
      {label}
      {id === color && (
        <span className="ml-auto">
          <AiOutlineCheck size={12} />
        </span>
      )}
    </div>
  );
}
