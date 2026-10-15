import { IDatabase } from "@/entities/database/model/database.type";
import { BoardCard, IBoardColumn } from "./model/board.types";
import { DatabaseColorId } from "@/entities/database/model/databaseColors";

interface StatusOption {
  id: string;
  name: string;
  color?: DatabaseColorId;
  position?: number;
}

interface StatusConfig {
  options?: StatusOption[];
}

export const buildBoard = (database: IDatabase, groupByFieldId?: string) => {
  const field = database?.fields.find((field) => field.id === groupByFieldId);

  const options = (field?.config as StatusConfig | null)?.options ?? [];

  const columnsBoard: IBoardColumn[] = [
    ...options.map((option) => ({
      id: option.id,
      name: option.name,
      color: option.color ?? "gray",
      position: option.position ?? 0,
    })),
  ];

  const itemsByColumnBoard: Record<string, string[]> = Object.fromEntries(
    columnsBoard.map((column) => [column.id, []]),
  );

  const rows = database?.rows ?? [];
  const cardsById = new Map<string, BoardCard>();

  for (const row of rows) {
    const value = row.cells?.find(
      (cell) => cell.fieldId === groupByFieldId,
    )?.value;
    const columnId = value ?? "no-status";

    if (!value || !itemsByColumnBoard[value]) continue;
    itemsByColumnBoard[columnId].push(row.id);
    cardsById.set(row.id, {
      id: row.id,
      pageId: row.pageId,
      title: row.page?.title ?? "Без названия",
      color: row.props?.color ?? null,
      position: row.position ?? 0,
    });
  }

  return {
    columns: columnsBoard,
    itemsByColumnBoard,
    cardsById,
  };
};
