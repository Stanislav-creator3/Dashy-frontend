import { collectionsApi } from "@/entities/collections/api/collections.api";
import { pagesApi } from "@/entities/pages/api/pages.api";
import { ButtonPageEdit } from "@/features/pages/buttonPageEdit";
import { useOutsideClick } from "@/shared/hooks/useOutsideClick";
import { cn } from "@/shared/utils/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { IconType } from "react-icons";
import {
  IoIosCheckmarkCircleOutline,
  IoIosCloseCircleOutline,
} from "react-icons/io";

export function CollectionSidebarDocumentItem({
  id,
  Icon,
  iconColor,
  title,
  className,
  isActive = false,
}: {
  id: string;
  Icon: IconType;
  iconColor?: string;
  title: string;
  className?: string;
  isActive: boolean;
}) {
  const params = useParams();
  const [isEdit, setIsEdit] = useState(false);
  const [titleDocument, setTitleDocument] = useState(title);
  const ref = useOutsideClick(() => setIsEdit(false));
  const refInput = useRef<HTMLInputElement | null>(null);

  const queryClient = useQueryClient();
  const { mutate: updateMutate, isPending } = useMutation({
    mutationFn: pagesApi.updatePage,
  });
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
      [".icon", { opacity: [1, 0] }, { duration: 0.2, at: "<" }],
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
      [".icon", { opacity: [0, 1] }, { duration: 0.2, at: "<" }],
    ]);
  };

  const handleUpdateTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitleDocument(event.target.value);
  };

  const handleUpdate = () => {
    const body = { title: titleDocument };
    updateMutate(
      { id, body },
      {
        onSuccess() {
          toast.success("Документ успешно обновлен", {
            position: "bottom-right",
          });
        },
        onError() {
          toast.error("Произошла ошибка", {
            position: "bottom-right",
          });
        },
        onSettled() {
          queryClient.invalidateQueries(
            collectionsApi.getCollections(`${params.id}`)
          );
          queryClient.invalidateQueries(pagesApi.getAllPages(`${params.id}`));
        },
      }
    );
    setIsEdit(false);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === "Enter") {
      event.preventDefault();
      handleUpdate();
    }
  };

  useEffect(() => {
    if (!isEdit) return;
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isEdit, handleKeyDown]);

  return (
    <motion.div key={id} className={cn("relative  text-sm", className)}>
      <AnimatePresence mode="wait">
        {isEdit ? (
          <motion.div
            key={"edit"}
            ref={ref}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between bg-black text-sm gap-2 p-2 cursor-pointer rounded-4xl w-full"
          >
            <input
              ref={refInput}
              className="ml-8 max-w-[100px] focus:outline-none"
              autoFocus
              value={titleDocument}
              onChange={handleUpdateTitle}
            />
            <div className="flex gap-1">
              <button onClick={handleUpdate}>
                <IoIosCheckmarkCircleOutline
                  className="text-green-500 cursor-pointer"
                  size={20}
                  aria-hidden="true"
                />
              </button>
              <button onClick={() => setIsEdit(false)}>
                <IoIosCloseCircleOutline
                  className="text-red-500 cursor-pointer"
                  size={20}
                  aria-hidden={true}
                />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            ref={scope}
            key="link"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between text-sm gap-2 p-2 cursor-pointer rounded-4xl w-full"
            onHoverStart={onHoverStartAnimate}
            onHoverEnd={onHoverEndAnimate}
            style={{
              background: isActive
                ? "rgba(255,255,255,1)"
                : "rgba(255,255,255,0)",
              color: isActive ? "var(--color-black)" : "var(--color-text)",
              transition: "ease",
              transitionDuration: "0.3s",
              transitionProperty: "background-color",
            }}
          >
            <Link
              className="flex w-full ml-8"
              href={`/projects/${params.id}/pages/${id}`}
            >
              <p className="flex w-full justify-between">
                {title}

                <span className="icon text-xl" style={{ color: iconColor }}>
                  <Icon />
                </span>
              </p>
            </Link>
            <div className="button absolute right-0 top-1/2 -translate-1/2">
              <ButtonPageEdit
                setIsEdit={setIsEdit}
                documentId={id}
                isHover={isHover}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
