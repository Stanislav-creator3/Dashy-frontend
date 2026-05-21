import { getIcon } from "@/shared/utils/getIcon";
import { CollectionSidebarItem } from "./CollectionSidebarItem";
import { CollectionSidebarDocumentItem } from "./CollectionSidebarDocumentItem";
import { ICollection } from "@/entities/collections/model/collection.types";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useParams, usePathname } from "next/navigation";
import { match } from "path-to-regexp";
import { cn } from "@/shared/utils/utils";

export function CollectionSidebarList({
  data,
  className,
}: {
  data: ICollection[];
  className?: string;
}) {
  const pathname = usePathname();
  const params = useParams();

  return (
    <div
      className={cn("flex flex-col gap-2 scrollbar max-h-[50vh]", className)}
    >
      <AnimatePresence mode="popLayout">
        {data.map((item) => (
          <motion.div
            layout="position"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { duration: 0.3 },
            }}
            exit={{ opacity: 0, x: -50 }}
            transition={{
              layout: { duration: 0.3 },
              opacity: { duration: 0.2 },
            }}
            key={item.id}
            className="flex flex-col gap-1"
          >
            <CollectionSidebarItem
              id={item.id}
              title={item.title}
              Icon={getIcon(item.icon)}
              iconColor={item.iconColor}
              isActive={
                !!match(`/projects/${params.id}/collections/${item.id}`)(
                  pathname
                )
              }
            />
            <AnimatePresence mode="popLayout">
              {item.documents &&
                item.documents.map((document) => (
                  <motion.div
                    layout="position"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      transition: { duration: 0.3 },
                    }}
                    exit={{ opacity: 0, x: -50 }}
                    key={document.id}
                    transition={{
                      layout: { duration: 0.3, ease: "easeInOut" },
                      opacity: { duration: 0.2 },
                    }}
                  >
                    <CollectionSidebarDocumentItem
                      id={document.id}
                      title={document.title}
                      Icon={getIcon(document.icon)}
                      isActive={
                        !!match(
                          `/projects/${params.id}/pages/${document.id}`
                        )(pathname)
                      }
                    />
                  </motion.div>
                ))}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
