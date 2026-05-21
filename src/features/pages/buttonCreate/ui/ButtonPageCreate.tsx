import { DropdownMenu, Tooltip } from "@/shared/ui";
import { cn } from "@/shared/utils/utils";
import { HTMLMotionProps, motion } from "motion/react";
import { FaPlus } from "react-icons/fa6";
import { useMenuItems } from "../hooks/useMenuItems";

interface IButtonPageCreateProps extends HTMLMotionProps<"button"> {
  className?: string;
  parentId: string ;
  projectId: string;
}

export default function ButtonPageCreate({
  className,
  parentId,
  projectId,
  ...props
}: IButtonPageCreateProps) {
  const itemMenu = useMenuItems({ projectId, parentId: parentId });
  return (
    <DropdownMenu items={itemMenu}>
      <Tooltip delay={1500} content={<p>Создать страницу</p>}>
        <motion.button
          className={cn(
            "flex items-center justify-center bg-black w-6 h-6 cursor-pointer rounded-2xl",
            className
          )}
          whileHover={{
            background: "var(--color-yellow)",
            transition: { type: "spring", stiffness: 50 },
          }}
          whileTap={{
            scale: 0.9,
          }}
          {...props}
        >
          <FaPlus className="text-white" />
        </motion.button>
      </Tooltip>
    </DropdownMenu>
  );
}
