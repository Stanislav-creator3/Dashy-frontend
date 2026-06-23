"use client";

import { ButtonPageCreate } from "@/features/pages/buttonCreate";
import { cn } from "@/shared/utils/utils";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useSideBarItem } from "../hooks/useSidebarItem";
import { Icon } from "@/shared/utils/getIcon";
import { IoIosArrowForward } from "react-icons/io";
import { ButtonPageEdit } from "@/features/pages/buttonPageEdit";
import { SidebarPagEdit } from "./SidebarPageEdit";
import { renderIcon } from "@/shared/utils/renderIcon";
import { useSortable } from "@dnd-kit/react/sortable";
import { TREE_INDENT } from "../model/constants";
import { mergeRefs } from "@/shared/utils/mergeRefs";

const config = {
  alignment: {
    x: "start",
    y: "center",
  },
  transition: {
    idle: true,
  },
} as const;

export function SidebarTreeItem({
  id,
  icon,
  iconColor,
  title,
  isActive,
  className,
  hasChildren,
  parentId,
  level,
  index,
  depth,
}: {
  id: string;
  parentId: string | null;
  icon?: Icon;
  iconColor?: string;
  title: string;
  isActive?: boolean;
  className?: string;
  hasChildren: boolean;
  level: number;
  index: number;
  depth: number;
}) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const { ref, isDragSource } = useSortable({
    ...config,
    id,
    index,
    data: {
      depth,
      parentId,
    },
  });

  const { isOpen, open, close } = useSideBarItem({ id });

  const [scope, animate] = useAnimate();
  const [isHover, setIsHover] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

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

  const showArrow = hasChildren;

  const onClickArrow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return isOpen ? close() : open();
  };

  const iconElement = icon && (
    <span className="relative text-xl" style={{ color: iconColor }}>
      {isHover && showArrow ? (
        <motion.button
          onClick={(e) => onClickArrow(e)}
          animate={{ rotate: isOpen ? 90 : 0 }}
          className="flex items-center justify-center cursor-pointer"
        >
          <IoIosArrowForward />
        </motion.button>
      ) : (
        renderIcon(icon)
      )}
    </span>
  );

  return (
    <motion.li
      layout
      transition={{
        layout: {
          type: "spring",
          bounce: 0.25,
        },
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isDragSource ? 0.4 : 1 }}
      exit={{ opacity: 0, y: -15, transition: { delay: index * 0.05 } }}
      className="flex flex-col gap-1"
      style={{
        marginLeft: depth * TREE_INDENT,
        border: isDragSource ? "1px solid var(--color-primary)" : "none",
        borderRadius: isDragSource ? "16px" : "none",
      }}
    >
      <AnimatePresence mode="wait">
        {isEdit ? (
          <motion.div
            key={"edit"}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SidebarPagEdit
              pageId={id}
              projectId={params.id as string}
              parentId={parentId}
              title={title}
              isEdit={isEdit}
              setIsEdit={setIsEdit}
            />
          </motion.div>
        ) : (
          <motion.div
            layout
            ref={mergeRefs(ref, scope)}
            onPointerDown={(e) => e.stopPropagation()}
            className={cn(
              "flex items-center justify-between min-w-40 text-text text-sm whitespace-nowrap overflow-hidden text-ellipsis gap-2 p-2 cursor-pointer rounded-4xl",
              className,
            )}
            initial={{
              color: isActive ? "var(--color-black)" : "var(--color-text)",
            }}
            animate={{
              opacity: [0, 1],
              background: isActive
                ? "rgba(255,255,255,1)"
                : "rgba(255,255,255,0)",
              color: isActive ? "var(--color-black)" : "var(--color-text)",
            }}
            exit={{
              opacity: 0,
            }}
            onHoverStart={onHoverStartAnimate}
            onHoverEnd={onHoverEndAnimate}
          >
            <div
              onClick={() => router.push(`/projects/${params.id}/pages/${id}`)}
              className="flex w-full"
            >
              <p className="flex gap-2 items-center">
                {iconElement}
                {title}
              </p>
            </div>
            <div className="flex gap-1 items-center justify-between button opacity-0">
              <ButtonPageEdit
                isHover={isHover}
                projectId={params.id as string}
                parentId={parentId}
                pageId={id}
                setIsEdit={setIsEdit}
              />
              <ButtonPageCreate projectId={params.id as string} parentId={id} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* <AnimatePresence>
        {isOpen && children && (
          <motion.div
            variants={childrenContainer}
            initial="closed"
            animate="open"
            exit="closed"
            layout
            className="flex flex-col gap-1 overflow-hidden"
            style={{ paddingLeft: `${level * 10}px` }}
          >
            {children.length > 0 ? (
              children.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={childItem}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  <SidebarTreeItem
                    index={index}
                    key={item.id}
                    parentId={id}
                    icon={getIcon(item.icon ?? item.type)}
                    iconColor={item.iconColor}
                    title={item.title}
                    id={item.id}
                    hasChildren={item.children}
                    level={level + 0.5}
                    isActive={
                      !!match(`/projects/${params.id}/pages/${item.id}`)(
                        pathname,
                      )
                    }
                  />
                </motion.div>
              ))
            ) : (
              <p className="text sm text-text">Страницы отсутствуют</p>
            )}
          </motion.div>
        )}
      </AnimatePresence> */}
    </motion.li>
  );
}
