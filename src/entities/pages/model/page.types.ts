import { IBlock } from "@/features/editor/model/block.types";

export enum PAGE_TYPE {
  PAGE = "PAGE",
  DATABASE = "DATABASE",
}

export interface IPage {
  id: string;
  title: string;
  icon: string | null;
  iconColor?: string;
  cover?: string | null;
  type: PAGE_TYPE;
  parentId: string | null;
  collectionId: string;
  position: number;
  blocks: IBlock[];
  createdAt: Date;
  updatedAt: Date;
  visitedAt: Date;
}

export interface IPageList {
  children: IPageList[];
  id: string;
  title: string;
  icon: string | null;
  iconColor?: string;
  type: PAGE_TYPE;
  position: number;
  parentId: string | null;
}

export interface ICreatePage {
  parentId: string | null;
  position?: "start" | "end";
  type: PAGE_TYPE;
}

export interface IUpdatePage {
  title?: string;
  icon?: string | null;
  iconColor?: string | null;
  cover?: string | null;
}
