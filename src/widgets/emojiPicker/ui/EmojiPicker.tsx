import dynamic from "next/dynamic";
import ru from "../ru/ru.json";
import {
  EmojiStyle,
  Theme,
  type PickerProps,
} from "emoji-picker-react";
import { useResolvedTheme } from "@/widgets/themeProvider/model/store";

const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function EmojiPicker(props: PickerProps) {
  const theme = useResolvedTheme();

  return (
    <div>
      <Picker
        emojiStyle={EmojiStyle.NATIVE}
        emojiData={ru as PickerProps["emojiData"]}
        theme={theme === "dark" ? Theme.DARK : Theme.LIGHT}
        {...props}
      />
    </div>
  );
}
