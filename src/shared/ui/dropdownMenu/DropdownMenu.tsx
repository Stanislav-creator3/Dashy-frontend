"use client";

import { cn } from "@/shared/utils/utils";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { DropdownMenuItem } from "./DropdownMenuItem";
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  FloatingNode,
  FloatingPortal,
  FloatingTree,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  useHover,
  useInteractions,
  useListNavigation,
  useRole,
  useTransitionStyles,
  useTypeahead,
} from "@floating-ui/react";
import { IoIosArrowForward } from "react-icons/io";

interface DropdownMenuItemProps {
  onClick?: () => void;
  href?: string;
  label: React.ReactNode;
  children?: DropdownMenuItemProps[];
}

export const MenuContext = React.createContext<{
  activeIndex: number | null;
  getItemProps: (
    userProps?: React.HTMLProps<HTMLElement>,
  ) => Record<string, unknown>;
  isOpen: boolean;
}>({
  activeIndex: null,
  getItemProps: () => ({}),
  isOpen: false,
});

interface DropdownMenuComponentProps {
  trigger: React.ReactNode;
  items?: DropdownMenuItemProps[];
  className?: string;
  enabledClick?: boolean;
  index?: number;
  totalIndex?: number;
}

export default function DropdownMenu(props: DropdownMenuComponentProps) {
  const parentId = useFloatingParentNodeId();

  if (parentId === null) {
    return (
      <FloatingTree>
        <DropdownComponentMenu {...props} />
      </FloatingTree>
    );
  }

  return <DropdownComponentMenu {...props} />;
}

export function DropdownComponentMenu({
  trigger,
  items,
  className,
  enabledClick = false,
  index = 0,
  totalIndex = 1,
}: DropdownMenuComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const tree = useFloatingTree();
  const nodeId = useFloatingNodeId();
  const parentId = useFloatingParentNodeId();

  const isNested = parentId != null;

  const { refs, floatingStyles, context } = useFloating({
    nodeId: nodeId,
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: isNested ? "right-start" : "bottom-start",
    middleware: [
      offset({ mainAxis: isNested ? 10 : 4, alignmentAxis: isNested ? -4 : 0 }),
      flip(),
      shift(),
    ],
    whileElementsMounted: autoUpdate,
  });

  const listRef = useRef<Array<HTMLDivElement | null>>([]);
  const labelsRef = React.useRef<Array<string | null>>([]);

  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    selectedIndex,
    onNavigate: setActiveIndex,
    loop: true,
    nested: isNested,
  });

  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    onMatch: isOpen ? setActiveIndex : undefined,
    activeIndex,
  });
  const { isMounted, styles } = useTransitionStyles(context);

  const click = useClick(context, {
    enabled: isNested || enabledClick,
    toggle: !isNested,
    ignoreMouse: isNested,
  });

  const role = useRole(context, { role: "menu" });

  const dismiss = useDismiss(context, {
    bubbles: true,
    outsidePressEvent: "mousedown",
  });

  const hover = useHover(context, {
    enabled: isNested || !enabledClick,
    delay: { open: isNested ? 75 : 0, close: 400 },
    handleClose: safePolygon(),
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [hover, click, dismiss, role, listNavigation, typeahead],
  );

  useEffect(() => {
    if (!tree) return;

    function handleTreeClick() {
      setIsOpen(false);
    }

    function onSubMenuOpen(event: { nodeId: string; parentId: string }) {
      if (event.nodeId !== nodeId && event.parentId === parentId) {
        setIsOpen(false);
      }
    }

    tree.events.on("click", handleTreeClick);
    tree.events.on("menuopen", onSubMenuOpen);

    return () => {
      tree.events.off("click", handleTreeClick);
      tree.events.off("menuopen", onSubMenuOpen);
    };
  }, [tree, nodeId, parentId]);

  React.useEffect(() => {
    if (isOpen && tree) {
      tree.events.emit("menuopen", { parentId, nodeId });
    }
  }, [tree, isOpen, nodeId, parentId]);

  return (
    <FloatingNode id={nodeId}>
      {isNested ? (
        <DropdownMenuItem
          ref={refs.setReference}
          submenu
          submenuOpen={isOpen}
          index={index}
          totalIndex={totalIndex}
          label={
            <div className="flex w-full items-center justify-between">
              {trigger}
              <span>
                <IoIosArrowForward />
              </span>
            </div>
          }
          {...getReferenceProps()}
        />
      ) : (
        <div ref={refs.setReference} {...getReferenceProps()}>
          {trigger}
        </div>
      )}
      <MenuContext.Provider value={{ activeIndex, getItemProps, isOpen }}>
        <FloatingList elementsRef={listRef} labelsRef={labelsRef}>
          <FloatingPortal>
            <AnimatePresence mode="wait">
              {isMounted && (
                <FloatingFocusManager
                  context={context}
                  modal={false}
                  initialFocus={isNested || !enabledClick ? -1 : 0}
                  returnFocus={!isNested}
                >
                  <motion.div
                    ref={refs.setFloating}
                    style={{ ...floatingStyles, zIndex: 10, ...styles }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.5 } }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "flex text-black rounded-lg shadow-2xl p-0.5 glass focus:outline-none",
                      className,
                    )}
                    {...getFloatingProps()}
                  >
                    <ul className="flex relative flex-col gap-0.5">
                      {items?.map((item, index) =>
                        item.children ? (
                          <DropdownComponentMenu
                            key={index}
                            trigger={item.label}
                            items={item.children}
                            className={className}
                            index={index}
                            totalIndex={items.length}
                          />
                        ) : (
                          <DropdownMenuItem
                            key={index}
                            index={index}
                            totalIndex={items.length}
                            label={item.label}
                            href={item.href}
                            onClick={item.onClick}
                          />
                        ),
                      )}
                    </ul>
                  </motion.div>
                </FloatingFocusManager>
              )}
            </AnimatePresence>
          </FloatingPortal>
        </FloatingList>
      </MenuContext.Provider>
    </FloatingNode>
  );
}
