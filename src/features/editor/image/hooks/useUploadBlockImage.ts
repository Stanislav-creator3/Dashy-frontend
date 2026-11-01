"use client";

import { useMutation } from "@tanstack/react-query";
import { $getNodeByKey, LexicalEditor } from "lexical";
import { $isImageBlockNode } from "../node/ImageBlockNode";
import { filesApi } from "@/entities/files/api/files.api";
import toast from "react-hot-toast";

export const useUploadBlockImage = ({
  editor,
  nodeKey,
}: {
  editor: LexicalEditor;
  nodeKey: string;
}) => {
  const mutationImage = useMutation({
    mutationFn: ({
      file,
      id,
      prevFileName,
    }: {
      file: File;
      id: string;
      prevFileName?: string;
    }) => filesApi.uploadImage(file),
    onSuccess: (fileName, { id, prevFileName }) => {
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if (!$isImageBlockNode(node)) return;
        const { imageList, ...item } = node.getProps();
        node.setProps({
          ...item,
          imageList: imageList?.map((item) =>
            item?.id === id ? { ...item, url: fileName.fileName } : item,
          ),
        });
      });

      if (prevFileName) {
        filesApi.remove(prevFileName);
      }
    },
    onError: (e) => {
      toast.error("Не удалось загрузить: " + e.message, {
        position: "bottom-right",
      });
      throw e;
    },
  });
  return {
    uploadImage: mutationImage.mutate,
    getIsLoadingUpload: (id: string) =>
      mutationImage.isPending && mutationImage.variables?.id === id,
  };
};
