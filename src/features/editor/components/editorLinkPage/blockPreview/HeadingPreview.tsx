import { IHeadingBlock } from "@/features/editor/model/block.types";
import { cn } from "@/lib/utils";
import { TextPreview } from "./TextPreview";

export function HeadingPreview({ block }: { block: IHeadingBlock }) {
  const level = Math.max(1, Math.min(3, block.props?.level || 1));
  const Tag: React.ElementType = level === 1 ? "h2" : level === 2 ? "h3" : "h4";

  return (
    <Tag
      className={cn(
        "whitespace-pre-wrap break-words text-text",
        level === 1 && "text-2xl font-bold tracking-tight",
        level === 2 && "text-xl font-semibold",
        level === 3 && "text-lg font-semibold",
      )}
    >
      <TextPreview segments={block.content} />
    </Tag>
  );
}
