"use client";

import { IImageItem } from "../model/type";
import { ImageBlock } from "@/widgets/imageBlock";

export default function ImageBlockView({
  blockId,
  nodeKey,
  imageList,
  layout = 1,
}: {
  blockId: string | null;
  nodeKey: string;
  imageList?: IImageItem[];
  layout?: 1 | 2 | 3 | 4;
}) {
  return <ImageBlock nodeKey={nodeKey} layout={layout} imageList={imageList} />;
}
