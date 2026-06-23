"use client";

import { IPageList } from "@/entities/pages/model/page.types";
import { FlattenedItem } from "@/widgets/sidebar/model/types";

export function flattenTree(items: IPageList[], depth = 0): FlattenedItem[] {
  if (!items) return [];
  return items.reduce<FlattenedItem[]>((acc, item, index) => {
    return [
      ...acc,
      { ...item, depth, index },
      ...flattenTree(item.children, depth + 1),
    ];
  }, []);
}
