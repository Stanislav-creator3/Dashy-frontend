import { Icon } from "./getIcon";

export function renderIcon(icon: Icon) {
  switch (icon.type) {
    case "icon":
      return <icon.Icon />;
    case "unicode":
      return (
        <span className="flex items-center justify-center leading-0 min-w-5 min-h-5 text-[20px] whitespace-nowrap">
          {icon.value}
        </span>
      );

    case "image":
      return <img src={icon.src} className="h-5 w-5 object-cover" />;
    default:
      return null;
  }
}
