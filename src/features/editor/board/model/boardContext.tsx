"use client";
import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { BoardCard, IBoardColumn } from "./board.types";

interface BoardContextValue {
  projectId: string;
  databaseId: string;
  groupByFieldId?: string;
  columnsItems: IBoardColumn[];
  itemsByColumn: Record<string, string[]>;
  setColumnsItems: Dispatch<SetStateAction<IBoardColumn[]>>;
  setItemsByColumn: Dispatch<SetStateAction<Record<string, string[]>>>;
  cardsById: Map<string, BoardCard>;
}

const BoardContext = createContext<BoardContextValue | null>(null);
export const BoardProvider = BoardContext.Provider;

export function useBoard() {
  const context = useContext(BoardContext);
  if (!context)
    throw new Error("context must be used within the context provider");
  return context;
}
