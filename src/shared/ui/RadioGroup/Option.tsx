import { cn } from "@/shared/utils/utils";
import { motion } from "motion/react";

export interface OptionType {
  value: string;
  content: React.ReactNode;
}

export interface OptionProps {
  value: OptionType["value"];
  content: OptionType["content"];
  selected: OptionType["value"];
  groupName: string;
  onChange?: (value: string) => void;
}

export function Option({
  value,
  content,
  selected,
  groupName,
  onChange,
}: OptionProps) {
  const handleChange = () => onChange?.(value);

  const inputId = `${groupName}_radio_item_with_value__${value}`;
  const isChecked = value === selected;

  return (
    <div className="block relative" data-checked={isChecked} key={value}>
      <input
        className="absolute opacity-0 w-0 h-0 m-0 p-0"
        type="radio"
        name={groupName}
        id={inputId}
        value={value}
        onChange={handleChange}
        checked={isChecked}
      />
      <label
        htmlFor={inputId}
        className="absolute inset-0 z-0 cursor-pointer"
      />
      <div className="flex items-center gap-1 relative z-10 pointer-events-none px-2 py-[7px]">
        <div
          data-marker
          className={cn(
            "relative size-5 rounded-full  border-2 border-gray-300 ",
            isChecked && "border-yellow ",
          )}
        >
          {isChecked ? (
            <motion.span
              layoutId={`${groupName}-marker`}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute inset-0 m-auto size-3 rounded-full bg-yellow"
            />
          ) : null}
        </div>
        {content}
      </div>
    </div>
  );
}
