import { Button, Popover } from "@/shared/ui";
import {
  ITheme,
  useSetTheme,
  useTheme,
} from "@/widgets/themeProvider/model/store";
import { useState } from "react";

export default function ChangeTheme() {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const translateTheme = ({ theme }: { theme: ITheme }) => {
    switch (theme) {
      case "system":
        return "Системная";
      case "light":
        return "Светлая";
      case "dark":
        return "Темная";
    }
  };
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <p className="text-gray text-sm">
          Выберите тему для Dashly на этом устройстве
        </p>
        <Popover
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          direction="end"
          trigger={<Button>{translateTheme({ theme })}</Button>}
        >
          <div className="flex flex-col w-[136px] p-2 rounded-lg border-border bg-foreground shadow gap-2">
            <Button onClick={() => useSetTheme("system")}>Системная</Button>
            <Button onClick={() => useSetTheme("light")}>Светлая</Button>
            <Button onClick={() => useSetTheme("dark")}>Темная</Button>
          </div>
        </Popover>
      </div>
    </div>
  );
}
