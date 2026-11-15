"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { databaseApi } from "@/entities/database/api/database.api";
import { buildBoard } from "../utils";
import { BoardContent } from "./BoardContent";

interface Props {
  databaseId: string;
  groupByFieldId?: string;
  canEdit: boolean;
}

export default function BoardView({
  databaseId,
  groupByFieldId,
  canEdit,
}: Props) {
  const { id: projectId } = useParams<{ id: string }>();
  const { data: database } = useQuery(
    databaseApi.getById({ id: databaseId, projectId }),
  );

  const boardModel = database && buildBoard(database, groupByFieldId);

  if (!database || !boardModel) return null;

  return (
    <BoardContent
      title={database.name}
      canEdit={canEdit}
      cardsById={boardModel.cardsById}
      databaseId={databaseId}
      groupByFieldId={groupByFieldId ?? ""}
      columnsBoard={boardModel.columns}
      itemsByColumnBoard={boardModel.itemsByColumnBoard}
    />
  );
}
