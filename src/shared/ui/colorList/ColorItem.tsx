import { AiOutlineCheck } from "react-icons/ai";

export const ColorItem = ({
  color,
  label,
  type,
  active,
}: {
  color: string;
  label: string;
  type?: "text" | "background";
  active?: string | null;
}) => {
  return (
    <div className="flex items-center gap-1">
      {type === "text" && (
        <>
          <div
            className={
              "flex items-center justify-center p-1 w-6.5 h-6.5 cursor-pointer border-4 rounded-sm"
            }
            style={{
              color: color,
              borderColor: color,
            }}
          >
            A
          </div>
          {label}
          {active === color && (
            <span className="ml-auto">
              <AiOutlineCheck size={12} />
            </span>
          )}
        </>
      )}
      {type === "background" && (
        <>
          <div
            className="p-1 w-6.5 h-6.5 cursor-pointer rounded-sm "
            style={{ backgroundColor: color }}
          />
          {label}
          {active === color && (
            <span className="ml-auto">
              <AiOutlineCheck size={12} />
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default ColorItem;
