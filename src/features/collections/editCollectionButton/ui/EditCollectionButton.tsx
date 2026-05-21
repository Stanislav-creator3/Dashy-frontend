import { DropdownMenu } from "@/shared/ui";
import { cn } from "@/shared/utils/utils";
import { AnimatePresence, motion, Variants } from "motion/react";
import { useMenuItems } from "../hooks/useMenuItems";

const variants: Variants = {
  initial: {
    y: 10,
  },
  animate: (index) => ({
    y: 0,
    transition: {
      delay: index * 0.055,
      type: "spring",
      bounce: index * 0.25,
    },
  }),
};

export default function EditCollectionButton({
  className,
  isHover = false,
  id,
}: {
  className?: string;
  isHover?: boolean;
  id: string;
}) {
  const itemMenu = useMenuItems(id);

  return (
    <AnimatePresence>
      <DropdownMenu items={itemMenu}>
        {isHover && (
          <motion.button
            className={cn(
              "bg-[rgba(0,0,0,0)] flex cursor-pointer rounded-xl py-2 px-1 gap-[3px]",
              className
            )}
            whileHover={{
              background: "var(--color-yellow)",
              transition: {
                duration: 0.3,
              },
            }}
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={variants}
                initial="initial"
                animate="animate"
                className="w-1 h-1 bg-black rounded-2xl"
              ></motion.div>
            ))}
          </motion.button>
        )}
      </DropdownMenu>
    </AnimatePresence>
  );
}
