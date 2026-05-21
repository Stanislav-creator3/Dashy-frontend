"use client";

import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { CollectionItemSkeleton } from "./CollecionItemSkeleton";
import { CollectionSidebarList } from "./CollectionSidebarList";
import Link from "next/link";
import { match } from "path-to-regexp";
import { usePathname } from "next/navigation";
import { AiOutlineHome } from "react-icons/ai";
import { TbPencil } from "react-icons/tb";
import { FaRegTrashAlt } from "react-icons/fa";
import { TiArchive } from "react-icons/ti";
import { collectionsApi } from "@/entities/collections/api/collections.api";
import { NewCollectionButton } from "@/features/collections/newCollectionButton";
import SidebarItem from "./SidebarItem";
import { pagesApi } from "@/entities/pages/api/pages.api";

export default function CollectionSidebar({ id }: { id: string }) {
  const { data, isLoading } = useQuery(pagesApi.getAllPages(id));
  const pathname = usePathname();
  const isActive = !!match(`/projects/${id}`)(pathname);

  return (
    <div className="glass-card py-4 px-2">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 2 } }}
            className="flex flex-col gap-4"
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <CollectionItemSkeleton key={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-col h-full"
            key="data"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1 } }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col gap-[2px] mb-5">
              <SidebarItem
                Icon={AiOutlineHome}
                href={`/projects/${id}`}
                isActive={isActive}
              >
                Домашняя страница
              </SidebarItem>
              <SidebarItem
                Icon={TbPencil}
                href={`/projects/${id}`}
                isActive={isActive}
              >
                Черновик
              </SidebarItem>
            </div>

            <div className="flex-1">
              <LayoutGroup>
                <p className="text-lg font-semibold px-2">Коллекции</p>
                {data && <CollectionSidebarList className="mb-1" data={data} />}
                <NewCollectionButton
                  href={`/projects/${id}/create-collections`}
                />
              </LayoutGroup>
            </div>

            <div className="mt-auto flex flex-col gap-[2px]">
              <SidebarItem
                Icon={TiArchive}
                href={`/projects/${id}`}
                isActive={isActive}
              >
                Архив
              </SidebarItem>
              <SidebarItem
                Icon={FaRegTrashAlt}
                href={`/projects/${id}`}
                isActive={isActive}
              >
                Корзина
              </SidebarItem>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
