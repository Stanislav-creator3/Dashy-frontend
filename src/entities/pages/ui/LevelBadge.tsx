import { cn } from "@/shared/utils/utils";
import { ACCESS_LEVEL } from "../model/page.types";

export const LEVEL_BADGE_STYLES = {
  none: "bg-(--color-bg-gray) text-(color:--color-text-gray)",
  view: "bg-(--color-bg-blue) text-(color:--color-text-blue)",
  edit: "bg-(--color-bg-green) text-(color:--color-text-green)",
};

const LEVELS = {
  [ACCESS_LEVEL.EDIT]: {
    label: "Редактирование",
    style: LEVEL_BADGE_STYLES.edit,
  },
  [ACCESS_LEVEL.VIEW]: { label: "Просмотр", style: LEVEL_BADGE_STYLES.view },
  [ACCESS_LEVEL.NONE]: { label: "Нет доступа", style: LEVEL_BADGE_STYLES.none },
};

const NONE = { label: "Нет доступа", style: LEVEL_BADGE_STYLES.none };

export default function LevelBadge({
  level,
  className,
}: {
  level?: ACCESS_LEVEL | null;
  className?: string;
}) {
  const { label, style } = (level && LEVELS[level]) || NONE;

  return (
    <span
      className={cn(
        "inline-flex h-5.5 items-center rounded-full px-2.5 text-xs font-medium",
        style,
        className,
      )}
    >
      {label}
    </span>
  );
}
