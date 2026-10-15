import { IPage } from "@/entities/pages/model/page.types";
import { DatabaseColorId } from "./databaseColors";

export type FieldType =
  | "TEXT"
  | "NUMBER"
  | "DATE"
  | "CHECKBOX"
  | "SELECT"
  | "MULTI-SELECT"
  | "FILE"
  | "RELATION"
  | "STATUS";

export const FIELD_TYPE = {
  TEXT: "TEXT",
  NUMBER: "NUMBER",
  DATE: "DATE",
  CHECKBOX: "CHECKBOX",
  SELECT: "SELECT",
  MULTI_SELECT: "MULTI-SELECT",
  FILE: "FILE",
  RELATION: "RELATION",
  STATUS: "STATUS",
};

export interface IDatabase {
  id: string;
  name: string;
  rows: IDatabaseRow[];
  fields: IDatabaseField[];
  createdAt: string;
  updatedAt: string;
  projectId: string;
}

export interface IDatabaseFieldConfig {
  options: {
    id: string;
    name: string;
    color: DatabaseColorId;
    position: number;
  }[];
}

export interface IDatabaseField {
  id: string;
  name: string;
  type: string;
  position: number;
  config: IDatabaseFieldConfig;
  createdAt: string;
  updatedAt: string;
  databaseId: string;
  cells: IDatabaseCell[];
}

export interface IDatabaseRowProps {
  color?: DatabaseColorId;
}

export interface IDatabaseRow {
  id: string;
  databaseId: string;
  position: number;
  pageId: string;
  page: IPage;
  cells: IDatabaseCell[];
  props?: IDatabaseRowProps;
  createdAt: string;
  updatedAt: string;
}

export interface IDatabaseCell {
  id: string;
  rowId: string;
  fieldId: string;
  value?: string;

  dateStart?: Date;
  dateEnd?: Date;
  assignees: IDatabaseCellAssignee[];
  createdAt: string;
  updatedAt: string;
}

export interface IDatabaseCellAssignee {
  id: string;
  cellId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
