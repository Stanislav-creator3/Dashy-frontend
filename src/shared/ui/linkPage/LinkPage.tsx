import { cn } from "@/shared/utils/utils";
import Link from "next/link";

export default function LinkPage({
  href,
  text,
  icon,
  className,
  textClassName,
}: {
  href: string;
  text: string;
  icon?: React.ReactNode;
  className?: string;
  textClassName?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex gap-2 items-center rounded-sm py-2 px-4 transition-colors hover:bg-bg-hover",
        className,
      )}
    >
      {icon && icon}

      <p className={cn("text-2xl", textClassName)}>{text}</p>
    </Link>
  );
}
