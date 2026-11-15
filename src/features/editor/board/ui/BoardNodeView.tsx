"use client";

import { useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useQueryClient } from "@tanstack/react-query";
import { $getNodeByKey } from "lexical";
import { useParams } from "next/navigation";
import { useCreateDatabase } from "@/entities/database/hooks/use-create-database";
import { databaseApi } from "@/entities/database/api/database.api";
import { FIELD_TYPE } from "@/entities/database/model/database.type";
import { $isBoardNode } from "../nodes/boardNode";
import { useCanEdit } from "../../model/editorContext";
import BoardView from "./BoardView";

interface Props {
  databaseId?: string;
  nodeKey: string;
  blockId: string | null;
  groupByFieldId?: string;
}

export default function BoardNodeView({
  databaseId,
  nodeKey,
  blockId,
  groupByFieldId,
}: Props) {
  const isCreatingRef = useRef(false);

  const queryClient = useQueryClient();
  const { id: projectId } = useParams<{ id: string }>();
  const { mutateAsync: createDatabase } = useCreateDatabase();
  const [editor] = useLexicalComposerContext();
  const canEdit = useCanEdit();

  useEffect(() => {
    if (!canEdit || databaseId || !blockId || isCreatingRef.current) return;
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
  }, [databaseId, blockId, canEdit]);

  if (!databaseId) return null;

  return (
    <BoardView
      databaseId={databaseId}
      groupByFieldId={groupByFieldId}
      canEdit={canEdit}
    />
  );
}
