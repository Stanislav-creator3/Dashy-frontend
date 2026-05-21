import { Button, Card, ColorList } from "@/shared/ui";
import { IconList } from "./IconList";
import { IIconList } from "../model/icons";
import { ChangeEvent, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/shared/hooks/useOutsideClick";
import { TextField } from "@/shared/ui/textField/TextField";
import { cn } from "@/shared/utils/utils";
import { IconType } from "react-icons";

export interface IIconSelect {
  SelectedIcon: IconType;
  selectedColor: string;
  iconsList: IIconList[];
  iconsColors: string[];
  onIconChange: (icon: IIconList) => void;
  onColorChange: (color: string) => void;
  className?: string;
}

export default function IconSelect({
  SelectedIcon,
  selectedColor,
  onIconChange,
  onColorChange,
  iconsColors,
  iconsList,
  className,
}: IIconSelect) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useOutsideClick(() => setIsOpen(false));

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    onColorChange?.(newColor || iconsColors[0]);
  };

  return (
    <div ref={ref} className={cn("relative z-100", className)}>
      <Button
        size="small"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <SelectedIcon color={selectedColor} size={25} />
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
            }}
          >
            <Card className="absolute top-0 left-[100%] flex flex-col gap-2 w-70">
              <IconList
                color={selectedColor}
                onClick={onIconChange}
                items={iconsList}
              />
              <ColorList onClick={onColorChange} items={iconsColors} />
              <TextField
                id="color"
                label="Цвет в HEX"
                onChange={handleInputChange}
                value={selectedColor}
                maxLength={7}
              />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
