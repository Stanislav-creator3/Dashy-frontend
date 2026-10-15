import { DatabaseColorId } from "@/entities/database/model/databaseColors";

export interface IBoardColumn {
  id: string;
  name: string;
  color: DatabaseColorId;
  position: number;
}

export interface BoardCard {
  id: string;
  pageId: string;
  title: string;
  color: DatabaseColorId;
  position: number;
}

export interface BoardModel {
  columns: IBoardColumn[];
  itemsByColumn: Record<string, string[]>;
  cardsById: Map<string, BoardCard>;
}
