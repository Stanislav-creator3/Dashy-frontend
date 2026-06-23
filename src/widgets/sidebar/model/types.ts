import { IPageList } from "@/entities/pages/model/page.types";

export interface FlattenedItem extends IPageList {
  depth: number;
  index: number;
}
