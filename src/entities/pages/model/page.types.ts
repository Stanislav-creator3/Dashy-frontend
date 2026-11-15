import { IBlock } from "@/features/editor/model/block.types";
import { IRole } from "@/entities/roles/model/role.types";

export enum PAGE_TYPE {
  PAGE = "PAGE",
  CARD = "CARD",
  DATABASE = "DATABASE",
}

export enum ACCESS_LEVEL {
  VIEW = "VIEW",
  EDIT = "EDIT",
}

export interface IPageAccessItem {
  level: ACCESS_LEVEL;
  role: IRole;
}

export interface IPageAccess {
  inheritAccess: boolean;
  access: IPageAccessItem[];
}

// Свой доступ страницы из списка по всему проекту
export interface IPageAccessSummary extends IPageAccess {
  id: string;
}

export interface IUpdatePageAccess {
  inheritAccess: boolean;
  access?: { roleId: string; level: ACCESS_LEVEL }[];
}

export interface IPage {
  id: string;
  access: ACCESS_LEVEL;
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
  access: ACCESS_LEVEL;
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
