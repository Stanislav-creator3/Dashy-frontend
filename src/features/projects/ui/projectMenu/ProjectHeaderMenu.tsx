"use client";

import { Button } from "@/shared/ui";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { AiOutlineSetting } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { Icon } from "@/shared/utils/getIcon";
import { renderIcon } from "@/shared/utils/renderIcon";

export function ProjectHeaderMenu({
  icon,
  name,
  onClosePopover,
}: {
  icon?: Icon | null;
  name: string;
  onClosePopover: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onClick = () => {

    const currentQuery = searchParams.toString();
    const currentUrl = currentQuery ? `${pathname}?${currentQuery}` : pathname;

    router.push(
      `/projects/${params.id}/settings?from=${encodeURIComponent(currentUrl)}`,
    );
    onClosePopover(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {icon && renderIcon(icon)}
        <p>{name}</p>
      </div>
      <Button onClick={onClick} className="flex items-center gap-1">
        <AiOutlineSetting /> Настройки
      </Button>
    </div>
  );
}
