"use client";

import { FormEvent, useState } from "react";
import { LayoutGroup } from "motion/react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";
import toast from "react-hot-toast";
import { Button, Popover, Upload } from "@/shared/ui";
import TabsContent from "@/shared/ui/tabs/TabsContent";
import { TextField } from "@/shared/ui/textField/TextField";
import { useUploadBlockImage } from "@/features/editor/image/hooks/useUploadBlockImage";
import { $isImageBlockNode } from "@/features/editor/image/node/ImageBlockNode";

interface IUploadPanelProps {
  id: string;
  trigger: React.ReactNode;
  nodeKey: string;
  offset?: number;
  setOpen?: (open: boolean) => void;
  url?: string;
}

export const UploadPanel = ({
  id,
  trigger,
  nodeKey,
  offset = 0,
  setOpen,
  url,
}: IUploadPanelProps) => {
  const [value, setValue] = useState("");
  const [editor] = useLexicalComposerContext();
  const { uploadImage, getIsLoadingUpload } = useUploadBlockImage({
    editor,
    nodeKey,
  });

  const onSubmitUrl = (event: FormEvent) => {
    event.preventDefault();
    const isUrl = /^https:\/\/.+?(?:\.jpg|\.jpeg|\.png|\.gif)$/i.test(
      value.trim(),
    );
    if (!isUrl) {
      toast.error("Некорректная ссылка", {
        position: "bottom-right",
      });
      return;
    }

    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (!$isImageBlockNode(node)) return;
      const { imageList, ...item } = node.getProps();
      node.setProps({
        ...item,
        imageList: imageList?.map((item) =>
          item?.id === id ? { ...item, url: value.trim() } : item,
        ),
      });
    });
  };
  const handleUpload = ({ file, id }: { file: File; id: string }) => {
    uploadImage({
      file,
      id,
      prevFileName: !url?.startsWith("https") ? url : undefined,
    });
  };
  return (
    <LayoutGroup id={id}>
      <Popover
        setOpen={setOpen}
        offsetValue={offset}
        enabledClick
        trigger={trigger}
      >
        <div className="w-125 glass-panel p-1 rounded-md">
          <TabsContent
            tabs={[
              {
                name: "Upload",
                label: "Загрузить",
                render: () => (
                  <Upload
                    isLoading={getIsLoadingUpload(id)}
                    onChange={(file) => {
                      if (!file) return;
                      handleUpload({ file, id });
                    }}
                  />
                ),
              },
              {
                name: "Link",
                label: "Ссылка",
                render: () => (
                  <form
                    onSubmit={(event) => onSubmitUrl(event)}
                    className="flex flex-col gap-1 items-center justify-center"
                  >
                    <TextField
                      onChange={(event) => setValue(event.target.value)}
                      placeholder="Введите url изображения"
                    />
                    <Button className="w-full">Отправить</Button>
                  </form>
                ),
              },
            ]}
          />
        </div>
      </Popover>
    </LayoutGroup>
  );
};
