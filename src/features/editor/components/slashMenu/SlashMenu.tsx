import { SlashMenuItem } from "./SlashMenuItem";
import { AnimatePresence, motion } from "motion/react";
import { SlashMenuOption } from "../../utils/slashItems";

export default function SlashMenu({
  menuOptions,
  selectedIndex,
  setHighlightedIndex,
  selectOptionAndCleanUp,
}: {
  menuOptions: SlashMenuOption[];
  selectedIndex: number;
  setHighlightedIndex: (index: number) => void;
  selectOptionAndCleanUp: (option: SlashMenuOption) => void;
}) {
  const categoryItems = menuOptions.reduce<Record<string, SlashMenuOption[]>>(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {},
  );
  let index = 0;
  return (
    <motion.div className="z-50 absolute top-0 left-0 p-1 bg-white h-55 w-60 overflow-scroll flex flex-col rounded-lg shadow-[0_5px_10px_#0000004d]">
      <motion.ul
        layout
        className="flex flex-col gap-1"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          layout: {
            duration: 0.2,
          },
        }}
      >
        <AnimatePresence>
          {Object.entries(categoryItems).map(([category, option]) => (
            <div key={category} className="flex flex-col gap-1">
              <p className="text-xs p-1 text-black/80">{category}</p>
              {option.map((option) => {
                const currentIndex = index++;

                return (
                  <SlashMenuItem
                    key={option.title}
                    isActive={selectedIndex === currentIndex}
                    option={option}
                    index={currentIndex}
                    ref={option.setRefElement}
                    setHighlightedIndex={setHighlightedIndex}
                    selectOptionAndCleanUp={selectOptionAndCleanUp}
                    totalIndex={menuOptions.length}
                  />
                );
              })}
            </div>
          ))}
        </AnimatePresence>
      </motion.ul>
    </motion.div>
  );
}
