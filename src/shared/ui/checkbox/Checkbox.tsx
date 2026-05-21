import { HTMLMotionProps } from "motion/react";
import * as motion from "motion/react-client";
import styles from "./styles.module.css";
import { cn } from "@/shared/utils/utils";

interface Props extends HTMLMotionProps<"input"> {
  isChecked: boolean;
  onChange: () => void;
  name?: string;
  label?: string;
  type?: string;
}

export default function Checkbox({
  isChecked = false,
  name,
  label,
  onChange,
  type = "dark",
  ...rest
}: Props) {
  return (
    <div>
      {label && <label htmlFor={name}>{label}</label>}
      <motion.input
        type="checkbox"
        id={name}
        className={cn(
          styles.input,
          type === "dark"
            ? "bg-[#4E4E4E] checked:bg-yellow"
            : "bg-white checked:bg-[#4E4E4E]"
        )}
        whileHover={{
          boxShadow: "0px 0px 5px 2px oklch(0.8867 0.1 105.88)",
        }}
        whileTap={{
          scale: 0.6,
          transition: {
            duration: 0.3,
          },
        }}
        checked={isChecked}
        onChange={onChange}
        {...rest}
      ></motion.input>
    </div>
  );
}
