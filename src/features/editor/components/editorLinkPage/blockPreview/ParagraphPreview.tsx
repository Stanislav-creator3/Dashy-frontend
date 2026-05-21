import { IParagraphBlock } from "@/features/editor/model/block.types";
import { TextPreview } from "./TextPreview";

export function ParagraphPreview({ block }: { block: IParagraphBlock }) {
  return (
    <p
      className="whitespace-pre-wrap break-words text-[15px] text-text"
    >
      <TextPreview segments={block.content} />
    </p>
  );
}
