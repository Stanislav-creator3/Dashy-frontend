import { IBlock } from "@/features/editor/model/block.types";

export enum PAGE_TYPE {
  PAGE = "PAGE",
  CARD = "CARD",
  DATABASE = "DATABASE",
}

export enum PAGE_ROLE {
  NO_ACCESS = "NO_ACCESS",
  VIEWER = "VIEWER",
  EDITOR = "EDITOR",
  FULL_ACCESS = "FULL_ACCESS",
}

export interface IPage {
  id: string;
  role: PAGE_ROLE;
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
  role: PAGE_ROLE;
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
  status?: string;
  type: PAGE_TYPE;
}

export interface IUpdatePage {
  title?: string;
  icon?: string | null;
  iconColor?: string | null;
  cover?: string | null;
}
