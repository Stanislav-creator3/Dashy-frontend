"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { buildBoard } from "../utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCreateDatabase } from "@/entities/database/hooks/use-create-database";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { databaseApi } from "@/entities/database/api/database.api";
import { $isBoardNode } from "../nodes/boardNode";
import { $getNodeByKey } from "lexical";
import { useParams } from "next/navigation";
import { FIELD_TYPE } from "@/entities/database/model/database.type";
import { BoardContent } from "./BoardContent";

interface Props {
  pageId?: string;
  databaseId?: string;
  nodeKey: string;
  blockId: string | null;
  name?: string;
  groupByFieldId?: string;
}

export default function BoardView({
  databaseId,
  pageId,
  nodeKey,
  blockId,
  groupByFieldId,
  name,
}: Props) {
  const isCreatingRef = useRef(false);

  const queryClient = useQueryClient();
  const { id: projectId } = useParams<{ id: string }>();
  const { mutateAsync: createDatabase, isPending } = useCreateDatabase();
  const { data: database } = useQuery(
    databaseApi.getById({ id: databaseId, projectId }),
  );

  const [editor] = useLexicalComposerContext();

  // const boardModel = useMemo(
  //   () => database && buildBoard(database, groupByFieldId),
  //   [database, groupByFieldId],
  // );

  const boardModel = database && buildBoard(database, groupByFieldId);

  useEffect(() => {
    if (databaseId || !blockId || isCreatingRef.current) return;
    isCreatingRef.current = true;
    createDatabase({
      projectId: projectId ?? "",
      data: {
        name: "New Board",
        blockId: blockId,
      },
    }).then((data) => {
      queryClient.setQueryData(
        databaseApi.getById({ projectId: projectId, id: data.id }).queryKey,
        data,
      );

      const statusField = data.fields.find(
        (field) => field.type === FIELD_TYPE.STATUS,
      );
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if (!$isBoardNode(node)) return;

        node.setProps({
          databaseId: data.id,
          groupByFieldId: statusField?.id,
        });
      });
    });
  }, [databaseId, blockId]);

  return (
    databaseId &&
    boardModel && (
      <BoardContent
        title={database.name}
        cardsById={boardModel?.cardsById ?? new Map()}
        databaseId={databaseId}
        groupByFieldId={groupByFieldId ?? ""}
        columnsBoard={boardModel?.columns ?? []}
        itemsByColumnBoard={boardModel?.itemsByColumnBoard ?? {}}
      />
    )
  );
}
