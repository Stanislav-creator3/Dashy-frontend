"use client";

import { Checkbox } from "@/shared/ui";
import { cn } from "@/shared/utils/utils";
import { motion } from "motion/react";
import { IconType } from "react-icons";
import { completedTask } from "../model/store";
import { renderIcon } from "@/shared/utils/renderIcon";
import { Icon } from "@/shared/utils/getIcon";

interface Props {
  id: string;
  icon: Icon;
  date?: Date;
  text: string;
  stage: string;
  typeStyle: string;
  completed: boolean;
}

export default function TaskItem({
  id,
  icon,
  date,
  text,
  typeStyle,
  stage,
  completed,
}: Props) {
  const styleSvgColor = completed ? "var(--color-white)" : "var(--color-black)";
  const styleSvgBackground = completed ? "#4E4E4E" : "var(--color-white)";

  const styleTextDecoration = completed ? "line-through" : "";
  const styleTextColor = completed ? "#6A6A6A" : "var(--color-white)";

  const onChange = () => {
    completedTask(id, !completed, stage);
  };

  return (
    <div className="flex items-center justify-between " key={id}>
      <div className="flex items-center gap-4 text-sm">
        <motion.span
          className={cn("rounded-full p-4")}
          initial={false}
          animate={{
            color: styleSvgColor,
            background: styleSvgBackground,
          }}
          transition={{
            duration: 0.3,
          }}
        >
          {renderIcon(icon)}
        </motion.span>
        <motion.p
          className={cn("flex flex-col text-lg ")}
          initial={false}
          animate={{
            textDecoration: styleTextDecoration,
            color: styleTextColor,
          }}
          transition={{
            duration: 0.3,
          }}
        >
          <span>{date?.toISOString()}</span>
          {text}
        </motion.p>
      </div>

      <Checkbox
        isChecked={completed}
        onChange={onChange}
        name="tasks"
        type={typeStyle}
      />
    </div>
  );
}
