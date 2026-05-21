"use client";

import { motion, useAnimate } from "motion/react";
import Link from "next/link";
import { IconType } from "react-icons";
import Image from "next/image";
import { FaPlus } from "react-icons/fa6";
import { cn } from "@/shared/utils/utils";
import { renderIcon } from "@/shared/utils/renderIcon";
import { Icon } from "@/shared/utils/getIcon";

interface Props {
  id: number;
  title: string;
  description: string;

  isDone: boolean;
  Icon: Icon;
  attendees: { id: string; name: string; avatar: string }[];
  className?: string;
}

export default function CardTimeEvent({
  id,
  title,
  description,
  isDone,
  Icon,
  attendees,
  className,
}: Props) {
  const [scope, animate] = useAnimate();

  const bgColor = isDone ? "bg-black" : "bg-white";
  const textTitleColor = isDone ? "text-white" : "text-black";
  const attendeesOther = attendees.slice(3).length;
  const attendeesSlice =
    attendeesOther > 1 ? attendees.slice(0, 3) : attendees.slice(0, 4);

  const onHoverStart = () => {
    animate([
      [".svg", { opacity: 0, visibility: "hidden" }, { duration: 0.3 }],
      [scope.current, { width: "300px" }, { duration: 0.3 }],
      [".content", { visibility: "visible", opacity: 1 }, { duration: 0.3 }],
    ]);
  };

  const onHoverEnd = () => {
    animate([
      [
        ".content",
        { visibility: "hidden", opacity: 0 },
        { duration: 0.3, delay: 0.5 },
      ],
      [scope.current, { width: "48px" }, { duration: 0.3 }],
      [".svg", { opacity: 1, visibility: "visible" }, { duration: 0.3 }],
    ]);
  };

  return (
    <motion.div
      ref={scope}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      className={cn(
        className,
        `flex relative items-center justify-center cursor-pointer rounded-full overflow-hidden px-1 py-1 w-[48px] h-12 ${bgColor} shadow-xl`
      )}
    >
      <motion.div className="absolute top-1/2 left-1/2 -translate-1/2  text-2xl svg">
        {renderIcon(Icon)}
      </motion.div>
      <motion.div
        className="flex items-center overflow-hidden content"
        style={{
          visibility: "hidden",
          opacity: 0,
        }}
      >
        <div className="text-xs ">
          <p className={`${textTitleColor}`}>{title}</p>
          <p className="text-gray-400">{description}</p>
        </div>
        <div className="flex items-center ml-4">
          {attendeesSlice.map((item) => (
            <Link
              className="nth-[n+2]:mask-[radial-gradient(ellipse_30px_40px_at_5px_center,_#0000_13px,_#000_13.5px)] nth-[n+2]:-ml-4"
              key={item.id}
              href={`/${item.id}`}
            >
              <Image
                width={40}
                height={40}
                className="rounded-full"
                src={item.avatar}
                alt={item.name}
              />
            </Link>
          ))}
          {attendeesOther > 1 && (
            <div className="w-[40px] h-[40px] -ml-4 p-1 flex items-center justify-end rounded-full bg-yellow mask-[radial-gradient(ellipse_30px_40px_at_5px_center,_#0000_13px,_#000_13.5px)]">
              <p className="text-sm flex items-baseline justify-end">
                <span>
                  <FaPlus size={10} />{" "}
                </span>
                {attendeesOther}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
