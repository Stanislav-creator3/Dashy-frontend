import { iconsList } from "@/widgets/iconSelect/model/icons";
import { getMediaSource } from "./get-media-source";
import { IconType } from "react-icons";

export type Icon =
  | { type: "icon"; Icon: IconType }
  | { type: "unicode"; value: string }
  | { type: "image"; src: string };

export function getIcon(type: string): Icon {
  if (!type) {
    return { type: "icon", Icon: iconsList[0].icon };
  }
  
  const icon = iconsList.find((item) => item.name === type);

  if (icon?.icon) {
    return { type: "icon", Icon: icon.icon };
  }

  if (type.startsWith("/icon")) {
    return { type: "image", src: getMediaSource(type) };
  }

  if (type.length <= 3) {
    return { type: "unicode", value: type };
  }

  return { type: "icon", Icon: iconsList[0].icon };
}
