"use client";

import { useMutation } from "@tanstack/react-query";
import { $getNodeByKey, LexicalEditor } from "lexical";
import { filesApi } from "@/entities/files/api/files.api";
import toast from "react-hot-toast";
import { $isImageBlockNode } from "@/features/editor/image/node/ImageBlockNode";

export const useRemoveImageFromBlock = ({
  editor,
  nodeKey,
}: {
  editor: LexicalEditor;
  nodeKey: string;
}) => {
  const mutationImage = useMutation({
    mutationFn: ({ fileName, id }: { fileName: string; id: string }) =>
      filesApi.remove(fileName),
    onSuccess: (fileName, { id }) => {
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if (!$isImageBlockNode(node)) return;
        const { imageList, ...item } = node.getProps();
        node.setProps({
          ...item,
          imageList: imageList?.map((item) =>
            item?.id === id ? { ...item, url: null } : item,
          ),
        });
      });
    },
    onError: (e) => {
      toast.error("Не удалось изображение: " + e.message, {
        position: "bottom-right",
      });
      throw e;
    },
  });
  return {
    removeImage: mutationImage.mutate,
    getIsLoadingRemove: (id: string) =>
      mutationImage.isPending && mutationImage.variables?.id === id,
  };
};
