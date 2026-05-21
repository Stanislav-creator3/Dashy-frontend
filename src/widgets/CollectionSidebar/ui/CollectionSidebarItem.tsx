import { EditCollectionButton } from "@/features/collections/editCollectionButton";
import { ButtonPageCreate } from "@/features/pages/buttonCreate";
import { cn } from "@/shared/utils/utils";
import { motion, useAnimate } from "motion/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { IconType } from "react-icons";

export function CollectionSidebarItem({
  id,
  Icon,
  iconColor,
  title,
  isActive,
  className,
}: {
  id: string;
  Icon?: IconType | null;
  iconColor?: string;
  title: string;
  isActive?: boolean;
  className?: string;
}) {
  const params = useParams();
  const [scope, animate] = useAnimate();
  const [isHover, setIsHover] = useState(false);

  const onHoverStartAnimate = () => {
    setIsHover(true);
    animate([
      [
        scope.current,
        {
          background: !isActive && "rgba(255,255,255,1)",
          color: "var(--color-black)",
        },
        { duration: 0.3 },
      ],
      [".button", { opacity: [0, 1] }, { duration: 0.3, at: "<" }],
      [".button", { y: [10, 0] }, { type: "spring", stiffness: 200, at: "<" }],
    ]);
  };

  const onHoverEndAnimate = () => {
    setIsHover(false);
    animate([
      [
        scope.current,
        {
          background: !isActive && "rgba(255,255,255,0)",
          color: !isActive && "var(--color-text)",
        },
        { duration: 0.3 },
      ],
      [".button", { opacity: [1, 0] }, { duration: 0.3, at: "<" }],
    ]);
  };

  const iconElement = Icon && (
    <span className="text-xl" style={{ color: iconColor }}>
      <Icon />
    </span>
  );

  return (
    <motion.div
      ref={scope}
      key={id}
      className={cn(
        "flex items-center justify-between text-sm gap-2 p-2 cursor-pointer rounded-4xl",
        className
      )}
      onHoverStart={onHoverStartAnimate}
      onHoverEnd={onHoverEndAnimate}
      style={{
        backgroundColor: isActive
          ? "rgba(255,255,255,1)"
          : "rgba(255,255,255,0)",
        color: isActive ? "var(--color-black)" : "var(--color-text)",
        transition: "ease",
        transitionDuration: "0.3s",
        transitionProperty: "background-color",
      }}
    >
      <Link
        href={`/projects/${params.id}/collections/${id}`}
        className="flex w-full"
      >
        <p className="flex gap-2 items-center">
          {iconElement}
          {title}
        </p>
      </Link>

      <div className="flex gap-1 items-center justify-between button opacity-0">
        <EditCollectionButton isHover={isHover} id={id} />
        <ButtonPageCreate id={id} />
      </div>
    </motion.div>
  );
}
